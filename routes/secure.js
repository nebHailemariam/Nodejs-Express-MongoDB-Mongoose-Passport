const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });

/**
 * @swagger
 * /secure-route:
 *   get:
 *     summary: Secure route
 *     description: Secure route demo.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */
router.get("/secure-route", auth, (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

module.exports = router;
