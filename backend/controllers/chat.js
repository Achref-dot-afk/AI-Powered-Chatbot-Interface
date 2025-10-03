const db = require("../config/db");
const axios = require("axios");
const { t } = require("../utils/i18n");

// OpenRouter API configuration
const openRouterAPI = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

const MODEL_MAPPING = {
  "model-1" : "mistralai/mistral-small-3.2-24b-instruct:free",
  "model-2" : "deepseek/deepseek-chat-v3.1:free",
  "model-3" : "meituan/longcat-flash-chat:free",
}

// Get user language from DB
async function getUserLanguage(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT language FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.language : "en");
    });
  });
}

// Save a message to the DB
const saveMessage = (conversationId, role, content) => {
  db.run(
    `INSERT INTO chats (conversation_id, role, content) VALUES (?, ?, ?)`,
    [conversationId, role, content],
    (err) => {
      if (err) console.error("DB error saving message:", err.message);
    }
  );
};

// Load all messages of a conversation
const loadConversationMessages = (conversationId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT role, content, createdAt FROM chats WHERE conversation_id = ? ORDER BY createdAt ASC`,
      [conversationId],
      (err, rows) => (err ? reject(err) : resolve(rows || []))
    );
  });
};

// Translate text dynamically using AI
const translateText = async (text, targetLang, modelId) => {
  const prompt =
    targetLang === "ar"
      ? `Translate the following text into formal Arabic preserving meaning:\n${text}`
      : `Translate the following text into English preserving meaning:\n${text}`;

  try {
    const response = await openRouterAPI.post("/chat/completions", {
      model: MODEL_MAPPING[modelId] || "mistralai/mistral-small-3.2-24b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Translation failed:", err.response?.data || err.message);
    return text; // fallback to original
  }
};

// Translate messages if user language differs from original
const translateMessages = async (messages, targetLang) => {
  return Promise.all(
    messages.map(async (msg) => {
      const translatedContent = await translateText(msg.content, targetLang);
      return { ...msg, content: translatedContent };
    })
  );
};

// Update conversation summary dynamically
const updateConversationSummary = async (
  conversationId,
  language,
  newMessage,
  modelId
) => {
  const chats = await loadConversationMessages(conversationId);
  const conversationText = [
    ...chats.map(
      (c) => `${c.role === "user" ? "User" : "Assistant"}: ${c.content}`
    ),
    `User: ${newMessage}`,
  ].join("\n");

  const prompt = `Summarize this conversation into a short phrase for display. 
Use ${
    language === "ar" ? "formal Arabic" : "English"
  } tone:\n\n${conversationText}`;

  try {
    const response = await openRouterAPI.post("/chat/completions", {
      model: MODEL_MAPPING[modelId] || "mistralai/mistral-small-3.2-24b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const summary = response.data.choices[0].message.content;

    db.run(
      `UPDATE conversations SET summary = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [summary, conversationId],
      (err) => {
        if (err) console.error("DB error updating summary:", err.message);
      }
    );
  } catch (err) {
    console.error(
      "Failed to generate summary:",
      err.response?.data || err.message
    );
  }
};

module.exports = {
  // Send a message to AI and save it
  chat: async (req, res) => {
    try {
      const userId = req.user.id;
      const userLang = await getUserLanguage(userId);
      const modelId = req.body.modelId || "model-1";
      const { conversationId } = req.params;
      const message = req.body.message;

      // if (!message)
      //   return res
      //     .status(400)
      //     .json({ error: t("chat.missingMessage", userLang) });

      let convId = conversationId;

      // Create new conversation if needed
      if (!convId) {
        const result = await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO conversations (user_id) VALUES (?)`,
            [userId],
            function (err) {
              if (err) reject(err);
              else resolve(this.lastID);
            }
          );
        });
        convId = result;
      }

      // Update summary including new message
      await updateConversationSummary(convId, userLang, message);

      // Save user message
      saveMessage(convId, "user", message);

      // AI prompt based on user language
      const aiPrompt =
        userLang === "ar"
          ? `اكتب ردًا باللغة العربية على الرسالة التالية: "${message}"`
          : `Write a response in English to the following message: "${message}"`;

      // Send to AI
      const response = await openRouterAPI.post("/chat/completions", {
        model: MODEL_MAPPING[modelId] || "mistralai/mistral-small-3.2-24b-instruct:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: aiPrompt },
        ],
        max_tokens: 1000,
      });

      let aiReply = response.data.choices[0].message.content;

      // Save AI reply
      saveMessage(convId, "assistant", aiReply);

      res.json({ conversationId: convId, reply: aiReply });
    } catch (err) {
      console.error(err.response?.data || err.message);
      res
        .status(500)
        .json({ error: t("chat.aiError", req.user.language || "en") });
    }
  },

  // Load conversation and translate messages if needed
  loadConversation: async (req, res) => {
    const userId = req.user.id;
    const userLang = await getUserLanguage(userId);
    const { conversationId } = req.params;

    if (!conversationId)
      return res
        .status(400)
        .json({ error: t("errors.missingConversationId", userLang) });

    db.get(
      `SELECT id, title, summary FROM conversations WHERE id = ? AND user_id = ?`,
      [conversationId, userId],
      async (err, conversation) => {
        if (err)
          return res.status(500).json({
            error: t("errors.dbError", userLang),
            details: err.message,
          });

        if (!conversation)
          return res
            .status(404)
            .json({ error: t("errors.conversationNotFound", userLang) });

        db.all(
          `SELECT role, content, createdAt FROM chats WHERE conversation_id = ? ORDER BY createdAt ASC`,
          [conversationId],
          async (err, messages) => {
            if (err)
              return res.status(500).json({
                error: t("errors.dbError", userLang),
                details: err.message,
              });

            const translatedMessages = await translateMessages(
              messages,
              userLang
            );

            res.json({
              conversation: {
                id: conversation.id,
                title: conversation.title,
                summary: conversation.summary,
                messages: translatedMessages || [],
              },
            });
          }
        );
      }
    );
  },
  getUserConversations: async (req, res) => {
    try {
      const userId = req.params.userId;
      // Wrap user fetch in a promise
      const user = await new Promise((resolve, reject) => {
        db.get(
          "SELECT id, language FROM users WHERE id = ?",
          [userId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });
      const userLang = await getUserLanguage(userId);

      if (!user)
        return res
          .status(404)
          .json({ error: t("chat.userNotFound", userLang) });

      // Wrap conversations fetch in a promise
      const conversations = await new Promise((resolve, reject) => {
        db.all(
          `SELECT id, title, summary, createdAt, updatedAt FROM conversations WHERE user_id = ? ORDER BY updatedAt DESC`,
          [userId],
          (err, rows) => (err ? reject(err) : resolve(rows || []))
        );
      });

      if (!conversations.length) return res.json({ conversations: [] });

      // Fetch messages and translate
      const results = await Promise.all(
        conversations.map(async (conv) => {
          const messages = await new Promise((resolve, reject) => {
            db.all(
              `SELECT role, content, createdAt FROM chats WHERE conversation_id = ? ORDER BY createdAt ASC`,
              [conv.id],
              (err, rows) => (err ? reject(err) : resolve(rows || []))
            );
          });

          // const translatedMessages = await translateMessages(
          //   messages,
          //   userLang
          // );

          let translatedSummary = conv.summary;
          // if (userLang !== "en") {
          //   translatedSummary = await translateText(conv.summary, userLang);
          // }

          return {
            ...conv,
            summary: translatedSummary,
            messages: messages,
          };
        })
      );

      res.json({ conversations: results });
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({
          error: t("errors.serverError", req.user?.language || "en"),
          details: err.message,
        });
      }
    }
  },
};
