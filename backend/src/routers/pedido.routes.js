import { Router } from "express";
import {
  addCart,
  uptdaOrder,
  deletItem,
  updaAmout,
  deletOrder,
  getOrder,
  getAllOrders,
} from "../controllers/pedidos.controllers.js";
import { validateJwt } from "../../middlewares/session.js";
// import { sessionVerified, rolAdmVerified } from "../../middlewares/session.js";

export const order = Router();

//add product to cart
order.post("/create", validateJwt, addCart);
//update order
order.put("/update", validateJwt, uptdaOrder);
//update amout of the product in the card
order.put("/", validateJwt, updaAmout);
//delete order
order.delete("/delete", validateJwt, deletOrder);
//delete item of the order
order.delete("element/:id", validateJwt, deletItem);
//get order for id user
order.get("/", validateJwt, getOrder);
//get all orders
order.get("/orders", getAllOrders);
