const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/users");
const Role = require("../models/Role");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log("Here");
      UserModel.findOne({
        $or: [{ username: username }, { email: req.email }],
      }).then(
        (user) => {
          if (!user) {
            UserModel.create({
              username: username,
              email: req.body.email,
              password: password,
              role: Role.User,
            }).then(
              (user) => {
                user = user.toObject();
                delete user.password;
                done(null, user);
              },
              (err) => {
                done(err);
              }
            );
          } else {
            if (user.username === username && user.email === req.body.email) {
              let err = new Error(
                "An account with the username and email already exists."
              );
              err.status = 400;
              done(err);
            } else if (user.username === username) {
              let err = new Error(
                "An account with the username already exists."
              );
              err.status = 400;
              done(err);
            } else if (user.email === req.body.email) {
              let err = new Error("An account with the email already exists.");
              err.status = 400;
              done(err);
            }
          }
        },
        (err) => {
          done(err);
        }
      );
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ username });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
