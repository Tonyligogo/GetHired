// const multer = require("multer");
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    // cb(null, "uploads/profile_pics/");
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + uniqueSuffix + ".png"); //consider file extension changes if error occurs
  },
});

export const uploads = multer({ storage: storage });

