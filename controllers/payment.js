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
  // collecting the response from sendcash
  console.log(req.body);

  res.sendStatus(200);
};

// BuyCoins webhook controller
const buyCoins = async (req, res) => {
  // collecting the response from buycoins
  console.log([req.body]);

  webhook_signature = req.headers['X-Webhook-Signature'];

  // sign events sent to webhook url with webhook token
  const hash = buycoins.webhook.sign(req.body, process.env.BUYCOINS_TOKEN);

  //verify that requests to your Webhook URL are coming from BuyCoins
  const isValid = buycoins.webhook.verify(
    req.body,
    process.env.BUYCOINS_TOKEN,
    webhook_signature
  );

  console.log(isValid);

  // if (isValid) {

  // }

  res.sendStatus(200);
};

// BuyCoins webhook controller
const cryptoDeposit = async (req, res) => {
  // collecting the response from buycoins
  console.log(req.body);

  try {
    // generating a litecoin account
    const account = await buycoins.accounts.createAddress('litecoin');

    // getting the rate of litecoin
    const rate = buycoins.orders.getPrices({ cryptocurrency: 'litecoin' });

    console.log(account);
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: 'Crypto deposit failed',
    });
    return;
  }

  res.json({
    status: true,
    message: 'Crypto deposit initiated',
  });

  return;
};

module.exports = { sendCash, buyCoins, cryptoDeposit };
