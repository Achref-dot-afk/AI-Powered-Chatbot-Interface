import { toast } from "react-hot-toast";
import axios from "axios";

const getConversations = async (userId, token) => {
  try {
    const res = await axios.get(`/api/chat/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Conversations fetched successfully");

    return res.data;
  } catch (err) {
    console.error("Error fetching conversations:", err);
    toast.error("Failed to fetch conversations");
    return [];
  }
};

const addMessageToConversation = async (conversationId, message, token, modelId) => {
  try {
    const res = await axios.post(
      `/api/chat/conversation/${conversationId}`,
      { message, modelId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data; // make sure backend returns the new message
  } catch (err) {
    console.error("Error adding message:", err);
    return null;
  }
};

const startNewConversation = async (userId, token) => {
  try {
    const res = await axios.post(
      "/api/chat",
      { message: "" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data; 
  } catch (err) {
    console.error("Error starting new conversation:", err);
    return null;
  }
};

export { getConversations, addMessageToConversation, startNewConversation };
