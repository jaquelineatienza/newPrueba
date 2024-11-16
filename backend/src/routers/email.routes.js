import { Router } from "express";

import { emails } from "../controllers/email.controller.js";

export const emailRouter = Router();

emailRouter.post("/", emails);
