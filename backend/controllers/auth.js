const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { t } = require("../utils/i18n.js");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const validLanguages = ["en", "ar"];

// Helper functions

module.exports = {
  signUp: async (req, res) => {
    try {
      const { email, password, language } = req.body;
      const lang = language;

      // ✅ Validate input
      if (!email || !password || !language) {
        return res
          .status(400)
          .json({ error: t("auth.missingCredentials", lang) });
      }

      if (!validLanguages.includes(language)) {
        return res
          .status(400)
          .json({ error: t("errors.invalidLanguage", lang) });
      }

      // ✅ Check if user already exists
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Database error", details: err.message });
          if (user)
            return res.status(400).json({ error: t("auth.userExists", lang) });

          // ✅ Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // ✅ Insert new user
          const query =
            "INSERT INTO users (email, password, language) VALUES (?, ?, ?)";
          db.run(query, [email, hashedPassword, language], function (err) {
            if (err)
              return res.status(500).json({ error: t("errors.dbError", lang) });

            // ✅ Create JWT token
            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, {
              expiresIn: "1h",
            });

            res.status(201).json({
              user: { id: this.lastID, email, language },
              token,
            });
          });
        }
      );
    } catch (err) {
      res.status(500).json({ error: t("errors.serverError", lang) });
    }
  },
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Validate input with fallback language
      const fallbackLang = "en";
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: t("auth.missingCredentials", fallbackLang) });
      }

      // Find user in database
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
          if (err) {
            return res
              .status(500)
              .json({ error: t("errors.dbError", fallbackLang) });
          }

          if (!user) {
            // Cannot know user language yet, use fallback
            return res
              .status(401)
              .json({ error: t("auth.invalidCredentials", fallbackLang) });
          }

          // Use the user's stored language
          const userLang = user.language || fallbackLang;

          // Compare password
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return res
              .status(401)
              .json({ error: t("auth.invalidCredentials", userLang) });
          }

          // Generate JWT
          const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
          );

          // Return user + token
          res.json({
            user: { id: user.id, email: user.email, language: user.language },
            token,
          });
        }
      );
    } catch (err) {
      res.status(500).json({ error: t("errors.serverError", "en") });
    }
  },
};
