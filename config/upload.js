const multer = require('multer'); 



const upload = multer({dest: 'uploads/'})

module.exports = upload; // <--- Exports the configured Multer instance