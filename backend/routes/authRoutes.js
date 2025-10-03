const auth = require("../controllers/auth.js");
const router = require("express").Router();

router.post("/signup", auth.signUp);
router.post("/signin", auth.signIn);


module.exports = router;