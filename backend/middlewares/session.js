import jwt from "jsonwebtoken";
import usuario from "../src/models/usuarios.model.js";

const JWT_SECRET = "mysecret";

export const validateJwt = async (req, res, next) => {
  try {
    if (!req.cookies) {
      console.log("Cookies are not available");
      return res.status(400).json({ message: "Cookies are required" });
    }

    const token = req.cookies.authToken || req.session.authToken;
    if (!token) {
      console.log("required session");
      return res.status(401).json({ message: "Session is required" });
    }

    // Verifica el token
    const { userId } = jwt.verify(token, JWT_SECRET);

    // Busca el usuario
    const user = await usuario.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("invalid session", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};
