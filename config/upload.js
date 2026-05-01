// const multer = require('multer'); 



// const upload = multer({dest: 'uploads/'})

// module.exports = upload; // <--- Exports the configured Multer instance

const multer = require('multer');
const path = require('path');

// Configure storage if you want to keep original extensions or specific paths
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 1. Limit: 5MB
    },
    fileFilter: (req, file, cb) => {
        // 2. Allowed Mime Types
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            // Reject the file with a custom error
            cb(new Error('Invalid file type. Only JPG, PNG, PDF, and TXT are allowed.'), false);
        }
    }
});

module.exports = upload;