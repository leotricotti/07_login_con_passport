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
        usernameField: "username",
        passwordField: "password",
      },
      async (req, username, password, done) => {
        try {
          const user = await userManager.getOne(username);
          if (user.length === 0) {
            return done(null, false, {
              message: "El usuario no existe",
            });
          }
          if (!isValidPassword(user[0].password, password)) {
            console.log("Contraseña incorrecta");
            return done(null, false, { message: "Contraseña incorrecta" });
          } else {
            console.log("Usuario y contraseña correctos");
            return done(null, user);
          }
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user[0].email);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getOne(id);
    done(null, user);
  });
};

export default initializePassport;
