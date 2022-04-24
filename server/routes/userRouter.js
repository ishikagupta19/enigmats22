const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require('../middleware/auth')

router.post("/register", userCtrl.register);
router.post("/signin", userCtrl.signin);

router.get("/getusers", userCtrl.getusers);
router.get("/leaderboard", userCtrl.leaderboard);
router.route("/update")
    .put(auth,userCtrl.update);

module.exports = router;
