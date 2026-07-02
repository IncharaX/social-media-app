import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

function fileFilter(_req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"));
    return;
  }

  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});
