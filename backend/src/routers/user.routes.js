import { Router } from "express";
import {
  updatUser,
  deleteUser,
  accountRecovery,
} from "../controllers/user.controllers.js";

export const userRoutes = Router();

userRoutes.post("/update", updatUser);
userRoutes.delete("/delete", deleteUser);
userRoutes.post("/reset", accountRecovery);
