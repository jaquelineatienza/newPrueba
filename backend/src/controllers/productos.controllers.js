import productos from "../models/productos.model.js";
import cloudinary from "../config.js";
import mongoose from "mongoose";
import fs from "fs";

export const cargarProducto = async (req, res) => {
  try {
    const {
      titulo,
      autor,
      descripcion,
      numeroEdicion,
      tipo,
      idioma,
      precio,
      stock,
      categoria,
    } = req.body;

    // Validación básica
    if (
      !titulo ||
      !autor ||
      !descripcion ||
      !numeroEdicion ||
      !tipo ||
      !idioma ||
      !precio ||
      !stock ||
      !categoria
    ) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const img = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    // Crear un nuevo producto
    const newProduct = new productos({
      titulo,
      autor,
      descripcion,
      numeroEdicion,
      tipo,
      idioma,
      precio,
      stock,
      categoria,
      imagen: img.secure_url,
    });

    // Guardar el producto en la base de datos
    const result = await newProduct.save();
    return res
      .status(200)
      .json({ msg: "Producto guardado correctamente", result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al guardar el producto" });
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const obtenerProducto =
      id === undefined
        ? await productos.find()
        : await productos.findOne({ _id: id });
    res.json(obtenerProducto);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "error interno del servidor" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await productos.findByIdAndDelete(id);

    if (resultado) {
      res.status(200).json({ msg: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el producto" });
  }
};
export const editarProducto = async (req, res) => {
  try {
    const {
      titulo,
      autor,
      descripcion,
      numeroEdicion,
      tipo,
      idioma,
      precio,
      stock,
      categoria,
    } = req.body;
    let imgUrl = publicFind.imagen;
    if (req.file && req.file.path) {
      const img = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      imgUrl = img.secure_url; // Actualiza la URL de la imagen
    }

    //productos editado
    const productoEditado = {
      titulo,
      autor,
      descripcion,
      numeroEdicion,
      tipo,
      idioma,
      precio,
      stock,
      categoria,
      imagen: imgUrl,
    };

    const { id } = req.params;
    const resultado = await productos.findByIdAndUpdate(id, productoEditado, {
      new: true,
    });
    if (resultado) {
      res.status(200).json({ msg: "Producto actualizado correctamente" });
    } else {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el producto" });
  }
};
