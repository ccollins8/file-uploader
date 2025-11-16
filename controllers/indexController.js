const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')



async function getIndex(req,res) {
    res.render("index", {user: req.user})
}

async function getSignUp(req,res) {
    res.render("sign-up")
}

async function getLogin(req,res) {
    res.render("login")
}

async function getLogout(req,res,next) {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
}

async function postSignUp(req,res) {
    const data = req.body
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const newUser = await prisma.user.create({
        data: {
            username: data.username,
            password: hashedPassword,
        }
    })
    // login immedietly after sign up
    req.login(newUser, (err) => {
        if (err) { 
            return next(err); 
        }
        // 3. Redirect the now-logged-in user to the home page
        res.redirect('/');
    });
    console.log('Should add row to User')
    
}

module.exports = {
    getIndex,
    getSignUp,
    getLogin,
    getLogout,
    postSignUp
}