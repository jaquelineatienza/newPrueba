import jwt from "jsonwebtoken";

const JWT_SECRET = "mysecret"; // Centraliza la clave secreta

export const generarJWT = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "4h" }, // Expira en 4 horas
      (error, token) => {
        if (error) {
          console.error(error);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};
