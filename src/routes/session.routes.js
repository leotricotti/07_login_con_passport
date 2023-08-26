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
  // passport.authenticate("login", {
  //   // failureRedirect: "/failLogin",
  // }),
  async (req, res) => {
    console.log("req.user", req.body);
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
  res.status(401).send({ message: "No se ha podido iniciar sesión" });
});

//Ruta que realiza el registro
router.post(
  "/signup",
  passport.authenticate("register", {
    failureRedirect: "/failRegister",
  }),
  async (req, res) => {
    res
      .status(200)
      .json({ status: "success", message: "Usuario creado con éxito" });
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

export default router;
