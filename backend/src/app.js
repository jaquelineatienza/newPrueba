//dependencias
import  cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import socketEvents from "./socket/socketEvents.js";
import logger from "morgan";
import mongoose from "./database/db.js";
import { Server } from "socket.io";
import { createServer } from "node:http";

//importacion de rutas
import { authRouter } from "./routers/auth.routes.js";
import { order } from "./routers/pedido.routes.js";
import { producRouter } from "./routers/productos.routes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { publiRouter } from "./routers/public.routes.js";
import { favoritos } from "./routers/fav.routes.js";
import { filRoutes } from "./routers/filter.routes.js";
import { payrouter } from "./routers/payment.routes.js";
import { comentRouter } from "./routers/coment.routes.js";
import { supRouter } from "./routers/supplier.routes.js";
import { userRoutes } from "./routers/user.routes.js";
import { emailRouter } from "./routers/email.routes.js";

import { chatbot } from "./routers/chatbot.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//inicializacion de el servidor
const app = express();

//aplicacion de los middlewares
app.use(
  cors({
    // Permitir solicitudes desde el front-end
    origin: [
      "http://localhost:5500",
      "http://localhost:3000",
      "http://localhost:5173",
    ],

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.static("./public"));
app.use(morgan("dev"));
app.use(express.json());
dotenv.config();
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mi_secreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(cookieParser());
const server = createServer(app);
// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173", // Cambia esto por la URL de tu frontend
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));
//rutas
app.use("/api/auth", authRouter);
app.use("/api/pedidos", order);
app.use("/api/productos", producRouter);
app.use("/api/favoritos", favoritos);
app.use("/api/filters", filRoutes);
app.use("/api/", payrouter);
app.use("/api/coments", comentRouter);
app.use("/api/publics", publiRouter);
app.use("/api/supplier", supRouter);
app.use("/api/user", userRoutes);
app.use("/api/email", emailRouter);

const io = new Server(server, {
  cors: corsOptions, // CORS para Socket.IO
});

//soker server
socketEvents(io);

//configuracion del puerto
const port = process.env.PORT || 3400;
server.listen(port, () => {
  console.log(
    `El servidor está funcionando en el puerto http://localhost:${port}`
  );
});
