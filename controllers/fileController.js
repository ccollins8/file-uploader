const prisma = require('../prisma/client')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

async function postUploadFile(req, res) {
    // 1. You must get parentId from req.body (sent via your hidden input)
    const { parentId } = req.body; 

    await prisma.file.create({
        data: {
            userId: req.user.id, // From Passport
            
            // 2. Fix capitalization to match your Prisma schema (fileName vs filename)
            fileName: req.file.filename, 
            originalName: req.file.originalname,
            
            // 3. Add the missing required fields from your schema
            filePath: req.file.path, 
            size: req.file.size,
            mimeType: req.file.mimetype,

            // 4. Link it to the current folder or Root
            folderId: parentId ? parseInt(parentId) : null, 
        }
    });

    const redirectUrl = parentId ? `/folders/${parentId}` : '/folders';
    res.redirect(redirectUrl);
}

async function getFolder(req, res) {
    const folderId = req.params.id ? parseInt(req.params.id) : null;

    res.render('folders', {
        user: req.user, //
        folders: await prisma.folder.findMany({ // Changed 'folder' to 'folders'
            where: {
                userId: req.user.id,
                parentId: folderId, //
            }
        }),
        currentFolderId: folderId,
        files: await prisma.file.findMany({ // Added files to render
            where: {
                userId: req.user.id,
                folderId: folderId, //
            }
        })
    });
}

async function postCreateFolder(req, res) {
    const { name, parentId } = req.body;
    console.log(req.body)
    
    await prisma.folder.create({
        data: {
            name: name,
            userId: req.user.id,
            parentId: parentId ? parseInt(parentId) : null, //
        }
    });

    // CRITICAL: Tell the browser to go back to the folder view
    const redirectUrl = parentId ? `/folders/${parentId}` : '/folders';
    res.redirect(redirectUrl);
}



async function getRoot(req,res) {
    
    const data = await prisma.folder.findMany()
    console.log(data)

    res.render('')
}

module.exports = {
    postUploadFile,
    postCreateFolder,
    getFolder
}