const user = require("../controllers/user.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const router = require("express").Router();

router.put("/:userId",verifyToken, user.updateLanguage);

module.exports = router;