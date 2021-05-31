const config = require("../config/secrets");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const express = require("express");
const auth = passport.authenticate("jwt", { session: false });
const isAdmin = require("../auth/auth");
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
 *                       example: LeanneGraham
 *                     email:
 *                       type: string
 *                       description: The user email.
 *                       example: LeanneG@gmailcom
 *                     Role:
 *                       type: string
 *                       description: The user role.
 *                       example: User
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
        delete user.password;

        return res.json({ token, user });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Users
 *     description: Endpoint for getting the list of users.
 *     responses:
 *       200:
 *         description: A list of all users.
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
 *                         _id:
 *                           type: string
 *                           description: The user ID.
 *                           example: 60794fbb29a0df9542e73190
 *                         username:
 *                           type: string
 *                           description: The user username.
 *                           example: LeanneGraham
 *                         email:
 *                           type: string
 *                           description: The user email.
 *                           example: LeanneG@gmailcom
 *                         Role:
 *                           type: string
 *                           description: The user role.
 *                           example: User
 *                         __v:
 *                           type: integer
 *                           description: The user __v.
 *                           example: 0
 */
router.get("/", auth, isAdmin, async (req, res, next) => {
  try {
    UserModel.find().then((users) => {
      users = users.map((user) => {
        user.password = null;
        return user;
      });
      res.json(users);
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/user:
 *   get:
 *     summary: User
 *     description: Endpoint for getting user.
 *     responses:
 *       200:
 *         description: Endpoint return the user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                _id:
 *                  type: string
 *                  description: The user ID.
 *                  example: 60794fbb29a0df9542e73190
 *                username:
 *                  type: string
 *                  description: The user username.
 *                  example: LeanneGraham
 *                email:
 *                  type: string
 *                  description: The user email.
 *                  example: LeanneG@gmailcom
 *                Role:
 *                  type: string
 *                  description: The user role.
 *                  example: User
 *                __v:
 *                  type: integer
 *                  description: The user __v.
 *                  example: 0
 */
router.get("/user", auth, async (req, res, next) => {
  try {
    UserModel.findOne({ _id: req.user._id }).then((user) => {
      res.json(user);
    });
  } catch (error) {
    next(error);
  }
});

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/users");

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
