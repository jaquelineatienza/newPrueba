import multer, { diskStorage } from "multer";

const guardar = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    if (file !== null) {
      const ext = file.originalname.split(".").pop();
      cb(null, Date.now() + "." + ext);
    }
  },
});

// Filtro de archivos
const filtro = (req, file, cb) => {
  if (
    file &&
    (file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"), false);
  }
};

// Configuración de Multer
export const subirImagen = multer({ storage: guardar, fileFilter: filtro });
