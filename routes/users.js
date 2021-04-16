const config = require("../config/secrets");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const express = require("express");
var router = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: User sign up
 *     description: User sign up endpoint that allows users to sign up with email, username, and password. Can be used to populate a list of fake users when prototyping or testing an API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: LeanneG@gmail.com
 *               username:
 *                 type: string
 *                 description: The user's username.
 *                 example: LeanneGraham
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password
 *     responses:
 *       200:
 *         description: The registered user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: success message
 *                   example: Sign up successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The user ID.
 *                       example: 60794fbb29a0df9542e73190
 *                     username:
 *                       type: string
 *                       description: The user username.
 *                       example: LeanneGraha
 *                     email:
 *                       type: string
 *                       description: The user email.
 *                       example: LeanneG@gmailcom
 *                     __v:
 *                       type: integer
 *                       description: The user __v.
 *                       example: 0
 */
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Sign up successful",
      user: req.user,
    });
  }
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: User login endpoint that allows users to login with username and password. Can be used to get a token for fake users when prototyping or testing an API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *                 example: LeanneGraham
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password
 *     responses:
 *       200:
 *         description: User token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: bearer token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYwNzk0ZTczZWI3NzY1OTQyYjEzOWI1MiJ9LCJpYXQiOjE2MTg1NjM3NTd9.jG6j0gJi9HDFXEw6InEiFh0Ia38FbexejsnwMO6Z-xc
 */
router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const err = new Error(info.message);
        err.status = 400;
        return next(err);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id };
        const token = jwt.sign({ user: body }, config.jwtSecret);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: config.jwtSecret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("Bearer"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = router;
