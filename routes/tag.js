// importing the required modules
const express = require('express');
const { Auth } = require('../middlewares/auth');

// instantiating the middleware
const auth = new Auth();

// creating the router object
const tagRouter = express.Router();

// requiring the user controllers
const user = require('../controllers/tag');

// generate paytag route
tagRouter.post('/generate', auth.loginRequired, user.generateTag);

// view all user paytag
tagRouter.get('/paytags', auth.loginRequired, user.paytags);

// exporting
module.exports = { tagRouter };
