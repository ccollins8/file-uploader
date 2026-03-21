const prisma = require('../prisma/client')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

async function postUploadFile(req,res) {
    console.log('you clicked upload here is body!')
    console.log(req.body)
    console.log('and here is file')
    console.log(req.file)
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
    });
}

async function postCreateFolder(req, res) {
    const { name, parentId } = req.body;
    
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