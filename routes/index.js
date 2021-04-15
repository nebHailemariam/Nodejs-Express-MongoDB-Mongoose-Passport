const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });

router.get("/profile", auth, (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

module.exports = router;
