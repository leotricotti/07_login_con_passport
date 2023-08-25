import passport from "passport";
import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";

//Inicializa variables
const router = Router();
const usersManager = new User();

//Ruta que realiza el login
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/failLogin",
  }),
  async (req, res) => {
    console.log(req.user);
    if (!req.user) {
      return res.status(401).json("error de autenticacion");
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    req.session.admin = true;

    res.send({ status: "success", mesage: "user logged", user: req.user });
  }
);

//Ruta que se ejecuta cuando falla el login
router.get("/failLogin", async (req, res) => {
  console.log("failed strategy");
  res.send({ error: "failed" });
});

//Ruta que realiza el registro
router.post(
  "/signup",
  passport.authenticate("register", {
    failureRedirect: "/failRegister",
  }),
  async (req, res) => {
    res.send({ status: "success", mesage: "user registered" });
  }
);

//Ruta que se ejecuta cuando falla el registro
router.get("/failRegister", async (req, res) => {
  console.log("failed strategy");
  res.send({ error: "failed" });
});

//Ruta que comprueba si el usuario está logueado
router.get("/check", async (req, res) => {
  try {
    const user = await req.session.user;

    if (user) {
      res.status(200).json({
        respuesta: "Bienvenido a la tienda",
      });
    } else {
      res.status(401).json({
        respuesta: "Algo salió mal. No hemos podido identificar al usuario",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

//Ruta que realiza el logout
router.get("/logout", async (req, res) => {
  try {
    const logout = req.session.destroy();
    if (logout) {
      res.redirect("/");
    } else {
      res.status(401).json({
        respuesta: "Algo salió mal. No hemos podido cerrar la sesión",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
