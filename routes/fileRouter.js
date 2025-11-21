const { Router } = require("express");
const fileController = require('../controllers/fileController')
const fileRouter = Router();
const uploadMiddleware = require('../config/upload');

fileRouter.post('/create-folder', fileController.postCreateFolder)


fileRouter.post('/upload', 
    uploadMiddleware.single('uploaded_file'), // <-- This is Multer, it saves the file!
    fileController.postUploadFile             // <-- This is the new controller, it saves the path to Prisma!
);


module.exports = fileRouter