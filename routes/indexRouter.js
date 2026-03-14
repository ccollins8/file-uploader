const { Router } = require("express");
const indexController = require('../controllers/indexController')
const indexRouter = Router();
const passport = require("passport");

indexRouter.get('/', indexController.getIndex);
indexRouter.get('/sign-up', indexController.getSignUp);
indexRouter.get('/login', indexController.getLogin);
indexRouter.get('/logout', indexController.getLogout);


indexRouter.post('/sign-up', indexController.postSignUp);

indexRouter.post(
    '/login', 
    passport.authenticate('local', {
      successRedirect: '/', 
      failureRedirect: '/login',
    })
  );

module.exports = indexRouter