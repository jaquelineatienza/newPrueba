import {
  createPublic,
  editPublics,
  getAllpublics,
  deletPublic,
} from "../controllers/public.controllers.js";
import { validateJwt } from "../../middlewares/session.js";
import {
  publicValidation,
  updateValidation,
} from "../validations/publicValidations.js";
import { subirImagen } from "../../middlewares/storage.js";
import { Router } from "express";
export const publiRouter = Router();

//ruta para cargar los productos
publiRouter.post(
  "/cargar",
  validateJwt,
  subirImagen.single("imagen"),
  createPublic
);

//update publics
publiRouter.put(
  "/edit",
  validateJwt,
  updateValidation,
  subirImagen.single("imagen"),
  editPublics
);

//get publics
publiRouter.get("/getPublication", getAllpublics);

// delte publics
publiRouter.delete("/deletePublication", validateJwt, deletPublic);
