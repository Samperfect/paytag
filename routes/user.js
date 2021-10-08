// importing the required modules
const express = require('express');
const { Auth } = require('../middlewares/auth');

// instantiating the middleware
const auth = new Auth();

// creating the router object
const userRouter = express.Router();

// requiring the user controllers
const user = require('../controllers/user');

// defining the routes
// register user get
userRouter.get('/signup', auth.loginRedirect, user.registerController);
// login user get
userRouter.get('/signin', auth.loginRedirect, user.loginController);
// register user post
userRouter.post('/signup', auth.loginRedirect, user.registerUser);
// login user post
userRouter.post('/signin', auth.loginRedirect, user.loginUser);

// authenticate user post
userRouter.get(
  '/logout',
  auth.loginRequired,
  auth.destroySession,
  user.logoutUser
);

// user dashboard route
userRouter.get('/', auth.loginRequired, user.dashboard);

// user authentication route
userRouter.get('/authenticate', auth.loginRedirect, user.authController);

// user authentication route
userRouter.post('/authenticate', auth.loginRedirect, user.authenticate);

// update user profile post
userRouter.post('/update', auth.loginRequired, user.updateUser);

// get all transactions route
userRouter.get('/transactions', auth.loginRequired, user.transactions);

// get all payments route
userRouter.get('/deposits', auth.loginRequired, user.allDeposits);

// exporting the mainRouter
module.exports = { userRouter };
