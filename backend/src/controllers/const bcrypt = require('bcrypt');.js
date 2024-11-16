// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";

// Suponiendo que esta es la contraseña almacenada como hash
const hashedPassword =
  "$2b$10$49xDdMZzbDJaBYgpR0vJpOEOFtjAofnF6CnQ4L2ZlolVTAmEHygNG"; // Hash de ejemplo

// La contraseña proporcionada por el usuario
const userProvidedPassword = "slJ!9@";

const verificarContrasena = async (userProvidedPassword, hashedPassword) => {
  try {
    const esValida = await bcrypt.compare(userProvidedPassword, hashedPassword);
    if (esValida) {
      console.log("La contraseña es válida");
    } else {
      console.log("La contraseña es incorrecta");
    }
  } catch (error) {
    console.error("Error al verificar la contraseña", error);
  }
};

// Llamada a la función
verificarContrasena(userProvidedPassword, hashedPassword);
