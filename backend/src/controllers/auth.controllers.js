import bcrypt from "bcrypt";
import { generarJWT } from "../helpers/generarJWT.js";
import usuario from "../models/usuarios.model.js";
import { validationResult } from "express-validator";

// register
export const register = async (req, res) => {
  const {
    nombreUsuario,
    apellido,
    fechaNacimiento,
    email,
    password,
    nombre,
    phone,
  } = req.body;

  try {
    // Validations
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json(errores);
    }

    // Encrypt password
    const contrasenia = bcrypt.hashSync(password, 10);
    const userFind = await usuario.findOne({ email: email });

    if (userFind != null) {
      return res.status(302).json({ msg: "Email not available" });
    }

    // Check if the email is for admin and assign the role
    const rol =
      email.toLowerCase() === "admin@aventuras.com" ? "admin" : "user";

    // Create new user with the specified role
    await new usuario({
      nombreUsuario,
      apellido,
      fechaNacimiento,
      email,
      contrasenia,
      nombre,
      rol, // Save the role in the database
      phone,
    }).save();
    res.status(200).json({ msg: "User registered successfully" });
  } catch (error) {
    console.log("Internal Server Error", error);
    res.status(500).json({ msg: "Error while registering user" });
  }
};

// login with JWT
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json(errores);
    }

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Insufficient data for authentication" });
    }

    const userFind = await usuario.findOne({ email });
    if (!userFind) {
      return res.status(400).json({ msg: "Incorrect email or password" });
    }

    const correctPassword = bcrypt.compareSync(password, userFind.contrasenia);
    if (!correctPassword) {
      return res.status(400).json({ msg: "Incorrect email or password" });
    }

    const token = await generarJWT(userFind._id);
    req.session.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000, // 1 hora
    });
    console.log(res.cookie);
    console.log(token, userFind);
    return res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .json({
        exitoLogin: true,
        msg: "Correct login",
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};
export const getMeCtrl = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//logout controller
export const logout = async (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "error closing session" });
    }
    res.clearCookie("connect.sid");

    return res.json({ message: "Session closed successfully" });
  });
};
