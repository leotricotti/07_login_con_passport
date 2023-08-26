import passport from "passport";
import local from "passport-local";
import User from "../dao/dbmanager/users.manager.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const userManager = new User();

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userManager.getOne(username);
          if (user.length > 0) {
            return done(null, false, {
              message: "Error al crear el usuario. El usuario ya existe",
            });
          } else {
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
            };
            console.log("newUser", newUser);
            let result = await userManager.signup(newUser);
            return done(null, result);
          }
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },
      async (req, username, password, done) => {
        console.log("username", username);
        console.log("password", password);
        console.log("req.body", req.body);
        // try {
        //   const user = await userManager.findOne(username);
        //   if (!user) {
        //     return done(null, false, { message: "Usuario no encontrado" });
        //   }
        //   if (!isValidPassword(user.password, password)) {
        //     return done(null, false, { message: "Contraseña incorrecta" });
        //   } else {
        //     return done(null, user);
        //   }
        // } catch (error) {
        //   return done("Error al obtener el usuario", error);
        // }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getOne(id);
    done(null, user);
  });
};

export default initializePassport;
