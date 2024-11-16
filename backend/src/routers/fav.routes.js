import { Router } from "express";
import { validateJwt } from "../../middlewares/session.js";
import {
  addToFav,
  getFavs,
  deleteFavs,
} from "../controllers/favorit.controllers.js";

export const favoritos = Router();
//add  to favorites
favoritos.post("/addFav", validateJwt, addToFav);
//get favs
favoritos.get("/getFav", validateJwt, getFavs);
//delete fav
favoritos.delete("/delete", validateJwt, deleteFavs);
