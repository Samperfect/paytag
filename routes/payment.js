// importing the required modules
const express = require('express');
const { Auth } = require('../middlewares/auth');

// instantiating the middleware
const auth = new Auth();

// creating the router object
const paymentRouter = express.Router();

// requiring the user controllers
const payment = require('../controllers/payment');

// webhook for sendcash
paymentRouter.post('/sendcash/verify/', payment.sendCash);

// webhook for buycoins
paymentRouter.post('/buycoins/verify/', payment.buyCoins);

// webhook for sendcash
paymentRouter.post('/buycoins/', auth.loginRequired, payment.cryptoDeposit);
// exporting
module.exports = { paymentRouter };
