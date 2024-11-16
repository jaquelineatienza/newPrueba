import { validarJWT } from "../helpers/validadJWT.js";
import usuario from "../models/usuarios.model.js";
import producto from "../models/productos.model.js";
import mongoose from "mongoose";

// add products a favoritos
export const addToFav = async (req, res) => {
  try {
    const { idProduct } = req.body;

    const userId = req.user._id;

    // Buscar el usuario
    const userFind = await usuario.findById(userId);
    if (!userFind) {
      return res.status(404).json({ msg: "User not find" });
    }

    // Buscar el producto
    const product = await producto.findById(idProduct);
    if (!product) {
      res.status(404).json({ msg: "Product nor find" });
    }

    const result = userFind.favorites.push({
      producto: product,
    });
    await userFind.save(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al agregar el producto a favoritos" });
  }
};

// get favorites por ID
export const getFavs = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId)
    const result = await usuario
      .findById(userId)
      .populate("favorites.producto");

    if (!result) {
      return res.status(404).json({ msg: "User not find" });
    }

    res.status(200).json({ favorites: result.favorites });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error ", error });
  }
};

//delete favorites
//delete favs
export const deleteFavs = async (req, res) => {
  const { idProduct } = req.body;
  try {
    const userId = req.user._id;

    const userFind = await usuario.findById(userId);
    if (!userFind) {
      return res.status(404).json({ msg: "User not found" });
    }

    const prodFind = userFind.favorites.find(
      (fav) => fav.producto && fav.producto.toString() === idProduct
    );

    if (!prodFind) {
      return res.status(404).json({ msg: "The product is not in favorites" });
    }

    const result = await usuario.updateOne(
      { _id: idUser },
      { $pull: { favorites: { producto: prodFind.producto } } }
    );

    if (result) {
      return res.status(200).json({ msg: "Deleted product from favorites" });
    } else {
      return res
        .status(400)
        .json({ msg: "Error removing product from favorites" });
    }
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ msg: "Internal server error", err });
  }
};
