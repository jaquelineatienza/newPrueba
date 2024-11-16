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
// import { sessionVerified, rolAdmVerified } from "../../middlewares/session.js";

export const order = Router();

//add product to cart
order.post("/create", addCart);
//update order
order.put("/update", uptdaOrder);
//update amout of the product in the card
order.put("/", updaAmout);
//delete order
order.delete("/delete", deletOrder);
//delete item of the order
order.delete("element/:id", deletItem);
//get order for id user
order.get("/", getOrder);
//get all orders
order.get("/orders", getAllOrders);
