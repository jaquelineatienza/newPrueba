import { Router } from "express";
export const supRouter = Router();
// import { rolAdmVerified } from "../../middlewares/session.js";
import {
  createSupplier,
  deleSupplier,
  getAllSupplier,
  updateSupplier,
} from "../controllers/proveedores.controllers.js";

//create a supplier
supRouter.post("/create/", createSupplier);
//edite supplier
supRouter.put("/edit/:id", updateSupplier);
//delete supplier
supRouter.delete("/delete/:id", deleSupplier);
//get all supplier
supRouter.get("/", getAllSupplier);
