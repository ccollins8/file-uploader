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

    // 1. Fetch current folder details (if not at root)
    let currentFolder = null;
    if (folderId) {
        currentFolder = await prisma.folder.findUnique({
            where: { id: folderId }
        });
    }

    // 2. Fetch subfolders
    const folders = await prisma.folder.findMany({
        where: {
            userId: req.user.id,
            parentId: folderId,
        }
    });

    // 3. Fetch files
    const files = await prisma.file.findMany({
        where: {
            userId: req.user.id,
            folderId: folderId,
        }
    });

    res.render('folders', {
        user: req.user,
        folders: folders,
        files: files,
        currentFolder: currentFolder, // This allows us to see the name
        currentFolderId: folderId,
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

async function postUpdateFolder(req, res) {
    const { id } = req.params;
    const { newName } = req.body;
    console.log("postUpdateFolder")
    console.log(id)
    console.log(newName)
    
    await prisma.folder.update({
        where: { id: parseInt(id) }, //
        data: { name: newName }
    });
    
    // Redirect back to the parent folder or root
    res.redirect('/');
}

async function postDeleteFolder(req, res) {
    const { id } = req.params;
    console.log("postDeleteFolder")
    console.log(id)

    // Note: This will fail if the folder has files/children 
    // unless you set up cascading deletes in Prisma.
    await prisma.folder.delete({
        where: { id: parseInt(id) } //
    });

    res.redirect('/');
}



async function getRoot(req,res) {
    
    const data = await prisma.folder.findMany()
    console.log(data)

    res.render('')
}

module.exports = {
    postUploadFile,
    postCreateFolder,
    getFolder,
    postUpdateFolder,
    postDeleteFolder
}