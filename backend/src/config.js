import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();

export const PAYPAL_API_KEY = process.env.PAYPAL_API_KEY;
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API = "https://api-m.sandbox.paypal.com";

// Configuración de Cloudinary

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary.v2;
