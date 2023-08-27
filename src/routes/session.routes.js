import passport from "passport";
import { Router } from "express";
import { createHash } from "../utils.js";
import User from "../dao/dbmanager/users.manager.js";

//Inicializa variables
const router = Router();
const usersManager = new User();

//Ruta que realiza el login
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "api/session/failLogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json("Error de autenticacion");
    }
    req.session.user = {
      first_name: req.user[0].first_name,
      last_name: req.user[0].last_name,
      email: req.user[0].email,
      age: req.user[0].age,
    };

    res.status(200).json({ message: "Usuario logueado con éxito" });
  }
);

//Ruta que se ejecuta cuando falla el login
router.get("/failLogin", async (req, res) => {
  res.status(401).json({ message: "No se ha podido iniciar sesión" });
});

//Ruta que realiza el registro
router.post(
  "/signup",
  passport.authenticate("register", {
    failureRedirect: "/failRegister",
  }),
  async (req, res) => {
    res.status(200).json({ message: "Usuario creado con éxito" });
  }
);

//Ruta que se ejecuta cuando falla el registro
router.get("/failRegister", async (req, res) => {
  res.send({ error: "Error al crear el ususario" });
});

//Ruta que recupera la contraseña
router.post("/forgot", async (req, res) => {
  const { username, newPassword } = req.body;

  const result = await usersManager.getOne(username);
  if (result.length === 0)
    return res.status(401).json({
      respuesta: "El usuario no existe",
    });
  else {
    const updatePassword = await usersManager.updatePassword(
      result[0]._id,
      createHash(newPassword)
    );
    res.status(200).json({
      respuesta: "Contrseña actualizada con éxito",
    });
  }
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

const handleLogout = (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/");
  });
};

router.get("/logout", handleLogout);

export default router;
