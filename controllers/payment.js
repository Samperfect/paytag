// importing the required modules
const { User } = require('../models/user');
const { Transaction } = require('../models/transaction');
const bcrypt = require('bcrypt');
const { Auth } = require('../middlewares/auth');
const { Utils } = require('../middlewares/utils');
const mongoose = require('mongoose');
const { Tag } = require('../models/tag');
// instantiationg internal middlewares
const auth = new Auth();
const utils = new Utils();

// setting up buycoins sdk
const { BuyCoins } = require('buycoins-sdk');

const buycoins = new BuyCoins({
  username: process.env.BUYCOINS_PUBLIC_KEY,
  password: process.env.BUYCOINS_SECRET_KEY,
});

// sendCash webhook controller
const sendCash = async (req, res) => {
  res.sendStatus(200);
};

// BuyCoins webhook controller
const buyCoins = async (req, res) => {
  // collecting the response from buycoins
  console.log(req.body);

  res.sendStatus(200);
};

// BuyCoins webhook controller
const cryptoDeposit = async (req, res) => {
  // collecting the response from buycoins
  console.log(req.body);

  res.json({
    status: true,
    message: 'Crypto deposit initiated',
  });
};

module.exports = { sendCash, buyCoins, cryptoDeposit };
