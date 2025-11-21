const prisma = require('../prisma/client')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

async function postUploadFile(req,res) {
    console.log('you clicked upload here is body!')
    console.log(req.body)
    console.log('and here is file')
    console.log(req.file)
}

async function getFiles(req,res) {
    console.log('you clicked upload here is body!')
    console.log(req.body)
    console.log('and here is file')
    console.log(req.file)
}

async function postCreateFolder(req,res) {
    const folder = req.body
    console.log(req.user.id)
    
    await prisma.folder.create({
        data: {
            name: folder.name,
            userId: req.user.id
        }
    })
}

async function getRoot(req,res) {
    
    const data = await prisma.folder.findMany()
    console.log(data)

    res.render('')
}

module.exports = {
    postUploadFile,
    postCreateFolder
}