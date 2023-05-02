import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model.js";

dotenv.config({path: ".env"});

export const localStrategy = new LocalStrategy(
  {
    usernameField: "user[email]",
    passwordField: "user[password]",
  },
  function (email, password, done) {
    User.findOne({email: email})
      .then(function (user) {
        if (!user || !user.validPassword(password)) {
          return done(null, false, {
            error: "username or password is invalid",
          });
        }
        return done(null, user);
      })
      .catch(done);
  }
);
