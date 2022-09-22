import multer = require("multer");

export const fileDest = 'uploads/'
export const uploadMiddleware = multer({ dest: fileDest, limits: { fileSize: 100000000 } });