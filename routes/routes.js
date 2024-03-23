const changeProfile = require('../changeProfile.multer');
const BasicController = require('../controllers/controller');
const upload = require('../multer');
const BasicRoutes = require('express').Router();

BasicRoutes.get('/', BasicController.profile);
BasicRoutes.get('/register', BasicController.register);
BasicRoutes.post('/saveUser', BasicController.saveUser);
BasicRoutes.get('/login', BasicController.login);
BasicRoutes.post('/checkLogin', BasicController.checkLogin);
BasicRoutes.get('/logOut', BasicController.logOut);
BasicRoutes.get('/feed', BasicController.feed);
//multer 
BasicRoutes.post('/uploads', upload.single('file'), BasicController.upload);
//delete post
BasicRoutes.get('/delete/:id', BasicController.deletePost);
BasicRoutes.post('/changeProfile', changeProfile.single('file'), BasicController.changeProfile);
BasicRoutes.get('/likes/:like',BasicController.likes);



module.exports = BasicRoutes;