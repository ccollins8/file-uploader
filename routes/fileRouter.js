const { Router } = require("express");
const fileController = require('../controllers/fileController')
const fileRouter = Router();
const uploadMiddleware = require('../config/upload');

// Add the '?' so /folders works without an ID
// Change getFolders to getFolder to match your controller
fileRouter.get('/folders', fileController.getFolder);
fileRouter.get('/folders/:id', fileController.getFolder);


fileRouter.post('/create-folder', fileController.postCreateFolder)


fileRouter.post('/upload', 
    uploadMiddleware.single('uploaded_file'), // <-- This is Multer, it saves the file!
    fileController.postUploadFile             // <-- This is the new controller, it saves the path to Prisma!
);


module.exports = fileRouter