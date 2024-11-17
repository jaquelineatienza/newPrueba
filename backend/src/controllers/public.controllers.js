import cloudinary from "../config.js";
import mongoose from "mongoose";
import fs from "fs";
import publics from "../models/public.models.js";
import { validarJWT } from "../helpers/validadJWT.js";
// Create public
export const createPublic = async (req, res) => {
  try {
    const { title, description, price, type, phone } = req.body;

    const userId = req.user._id;
    const img = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const newPublic = new publics({
      title,
      autor: userId,
      description,
      price,
      imagen: img.secure_url,
      type,
      phone,
    });

    const result = await newPublic.save();
    if (!result) {
      return res.status(400).json({ msg: "error uploading post" });
    }
    return res.status(201).json({ msg: "post uploaded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//get all publics or for id
export const getAllpublics = async (req, res) => {
  try {
    const { id } = req.body;
    const getPublics = !id
      ? await publics.find()
      : await publics.find({ _id: id });

    //not publics
    if (!getPublics) {
      res.status(402).json({ msg: "no post" });
    }
    return res.status(200).json({ getPublics });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};
export const myPublics = async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;

  const getPublics = await publics.find({ autor: userId });

  //not publics
  if (!getPublics) {
    res.status(402).json({ msg: "no post" });
  }
  return res.status(200).json({ getPublics });
};

//edit publics for id
export const editPublics = async (req, res) => {
  try {
    const { idPublic } = req.params;
    const userId = req.user._id;

    const { title, description, price, type, phone } = req.body;
    console.log(title, price, description);

    const publicFind = await publics.findById(idPublic);
    console.log(publicFind, idPublic);
    if (!publicFind) {
      console.log("public not find");
      return res.status(404).json({ msg: "Post not found" });
    }

    let imgUrl = publicFind.imagen;
    if (req.file && req.file.path) {
      const img = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      imgUrl = img.secure_url; // Actualiza la URL de la imagen
    }

    const updatedData = {
      title,
      price,
      description,
      type,
      phone,
      imagen: imgUrl,
    };

    const result = await publics.findByIdAndUpdate(
      idPublic,
      { $set: updatedData },
      { new: true }
    );

    if (!result) {
      return res.status(304).json({ msg: "Post not updated" });
    }

    return res.status(200).json({ msg: "Post updated", result });
  } catch (error) {
    console.log("internal server error", error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

//delet public
export const deletPublic = async (req, res) => {
  try {
    // const { idUser } = req.params;
    const token = req.headers.token;
    const { idPublic } = req.body;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "Debe registrarse para realizar esa tarea" });
    }

    const usuario = await validarJWT(token);
    if (!usuario) {
      return res.status(401).json({ msg: "Token inválido" });
    }
    const idUser = usuario._id;
    const ObjectId = mongoose.Types.ObjectId;
    const publicFind = await publics.findOne({ idPublic });

    if (!publicFind) {
      res.status(402).json({ msg: "not post" });
    }

    if ((usuario.rol === "user") & (idUser != publicFind.autor)) {
      res.status(401).json({ msg: "You are not the author of this post" });
    }

    // Eliminamos el post usando el _id directamente
    const result = await publics.findByIdAndDelete(idPublic);

    if (!result) {
      res.status(304).json({ msg: "Post not delete" });
    } else {
      res.status(201).json({ msg: "post delete" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error ", error });
  }
};
