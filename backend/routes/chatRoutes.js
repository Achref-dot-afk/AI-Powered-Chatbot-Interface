const chat = require("../controllers/chat.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const router = require("express").Router();

router.post("/conversation/:conversationId",verifyToken, chat.chat);
router.post("/",verifyToken, chat.chat);
router.get("/conversation/:conversationId",verifyToken, chat.loadConversation);
router.get("/user/:userId",verifyToken, chat.getUserConversations);

module.exports = router;