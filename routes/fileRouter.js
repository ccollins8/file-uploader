const { Router } = require("express");
const multer = require('multer')
const fileController = require('../controllers/fileController')
const fileRouter = Router();
const upload = require('../config/upload');

// Add the '?' so /folders works without an ID
// Change getFolders to getFolder to match your controller
fileRouter.get('/folders', fileController.getFolder);
fileRouter.get('/folders/:id', fileController.getFolder);

fileRouter.get('/files/:id', fileController.getFile);

fileRouter.get('/files/:id/download', fileController.downloadFile);
// fileRouter.js
fileRouter.post('/folders/:id/update', fileController.postUpdateFolder);
fileRouter.post('/folders/:id/delete', fileController.postDeleteFolder);


fileRouter.post('/create-folder', fileController.postCreateFolder)


fileRouter.post('/upload-file', (req, res, next) => {
    // Manually call the multer middleware to catch errors
    upload.single('uploaded_file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // This catches "File too large" (limits)
            return res.status(400).send(`Multer Error: ${err.message}`);
        } else if (err) {
            // This catches your "Invalid file type" error
            return res.status(400).send(`Validation Error: ${err.message}`);
        }
        
        // If no error, proceed to the controller
        fileController.postUploadFile(req, res);
    });
});


module.exports = fileRouter