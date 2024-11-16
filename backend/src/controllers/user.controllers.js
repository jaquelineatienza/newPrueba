import usuario from "../models/usuarios.model.js";
import generarContrasena from "../helpers/generatePass.js";
import bcrypt from "bcrypt";
import passwordEmail from "./email.controller.js";
//update users
export const updatUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to perform this task" });
    }
    const usuario = await validarJWT(token);

    !usuario
      ? res.status(401).json({ msg: "invalid token" })
      : (idUser = usuario._id);
    const contrasenia = bcrypt.hashSync(password, 10);
    const userUpdate = { username, contrasenia, email };

    const result = usuario.findByIdAndUpdate(idUser, userUpdate, { new: true });
    !result
      ? res.status(404).json({ msg: "error updating user" })
      : res.status(201).json({ msg: "user update" });
  } catch (error) {
    console.log("Internal Server Error ", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};
//delete user
export const deleteUser = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to perform this task" });
    }
    const usuario = await validarJWT(token);

    !usuario
      ? res.status(401).json({ msg: "invalid token" })
      : (idUser = usuario._id);
    const userUpdate = { username, password, email };

    const result = usuario.findByIdAndUpdate(idUser, userUpdate, { new: true });
    !result
      ? res.status(404).json({ msg: "error deleting user" })
      : res.status(201).json({ msg: "user delete" });
  } catch (error) {
    console.log("Internal Server Error ", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};
//account Recovery
export const accountRecovery = async (req, res) => {
  const { email } = req.body;
  try {
    // Buscar el usuario por correo electrónico
    const userFind = await usuario.findOne({ email: email });

    if (!userFind) {
      return res.status(404).json({ msg: "User not found" });
    }

    const idUser = userFind._id;
    const newPassword = generarContrasena(); // Generar nueva contraseña
    console.log(newPassword);

    // Hash de la nueva contraseña
    const contrasenia = bcrypt.hashSync(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    const result = await usuario.findByIdAndUpdate(
      idUser,
      { contrasenia: contrasenia }, // Asegúrate de que el campo sea 'password'
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ msg: "Error al actualizar la contraseña" });
    }

    // Enviar la nueva contraseña por correo electrónico
    await passwordEmail(newPassword, email);

    res
      .status(200)
      .json({ msg: "La nueva contraseña ha sido enviada", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error interno del servidor", error });
  }
};
//get user
export const getUser = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "You must register to perform this task" });
    }
    const usuario = await validarJWT(token);

    !usuario
      ? res.status(401).json({ msg: "invalid token" })
      : (idUser = usuario._id);

    const result = usuario.findById(idUser);

    res.status(201).json({ msg: "user", result });
  } catch (error) {
    console.log("internal server error", error);
    res.status(500).json({ msg: "internal server error", error });
  }
};
