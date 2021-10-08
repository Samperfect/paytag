// importing the required modules
const { User } = require('../models/user');
const { Transaction } = require('../models/transaction');
const { Payment } = require('../models/payment');
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
  console.log(req.body);

  const payload = req.body;

  webhook_signature = req.get('X-Webhook-Signature');

  console.log(webhook_signature);

  console.log(req.headers);

  //verify that requests to your Webhook URL are coming from BuyCoins
  const isValid = buycoins.webhook.verify(
    req.body,
    process.env.BUYCOINS_TOKEN,
    webhook_signature
  );

  console.log(isValid);

  // if (isValid) {

  // }
  // only responding to crypto tranfer events
  if (payload.payload.event !== 'coins.incoming') {
    res.sendStatus(400);
    return;
  }

  var status = payload.payload.data.confirmed;
  var amount = payload.payload.data.amount;
  var address = payload.payload.data.address;

  // searching for the payment corresponding to the address
  const payment = await Payment.findOne({ address: address });

  if (!payment) {
    res.sendStatus(400);
    return;
  }
  if (status === false) {
    payment.status = 'Confirming';
    await payment.save();
    res.sendStatus(200);
    return;
  } else {
    payment.status = 'Confirmed';
    payment.received = amount;

    const user = await User.findById(payment.author);

    if (!user) {
      res.sendStatus(400);
      return;
    }

    if (user.currency === '$') {
      console.log('DOLLAR PROCESSING');
      res.sendStatus(200);
      return;
    }

    const price = await buycoins.orders.getPrices({
      cryptocurrency: 'litecoin',
    });

    const rate = price[0].buyPricePerCoin;

    const sum = rate * amount;

    payment.credited = sum.toFixed(2);

    user.wallet = user.wallet + sum.toFixed(2);
    user.income = user.income + sum.toFixed(2);

    // saving the user object
    await user.save();

    // saving the payment object
    await payment.save();

    // generating the transaction object
    const transact = {
      amount: sum.toFixed(2),
      description: 'Completed crypto deposit',
      sign: '+',
      author: user._id,
      _id: new mongoose.Types.ObjectId(),
    };

    const transaction = new Transaction(transact);

    await transaction.save();

    // adding the transaction to the user object
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $push: {
          transactions: {
            transactionId: transaction._id,
          },
          $position: 0,
        },
      }
    );

    res.sendStatus(200);
    return;
  }
};

// BuyCoins webhook controller
const cryptoDeposit = async (req, res) => {
  var error;
  // collecting the user request data
  const body = req.body;

  //  checking whethehr necessary data was sent
  if (!body.amount) {
    error = 'An amount is required';
    res.json({
      status: false,
      error: error,
    });

    return;
  }

  try {
    // generating a litecoin account
    const account = await buycoins.accounts.createAddress('litecoin');
    const address = account.address;
    // getting the rate of litecoin
    const price = await buycoins.orders.getPrices({
      cryptocurrency: 'litecoin',
    });

    const rate = price[0].buyPricePerCoin;

    if (req.user.currency === '$') {
      console.log('dollar deposit');
      error = 'Dollar deposit unavailable';
      res.json({
        status: false,
        error: error,
      });
      return;
    }

    // calculating the amount of crypto user needs to deposit
    const cryptoAmount = Number(body.amount) / rate;

    // creating a new payment deposit object
    const deposit = new Payment({
      amount: body.amount,
      rate: rate,
      _id: new mongoose.Types.ObjectId(),
      author: req.user._id,
      address: address,
      method: 'crypto',
      status: 'Pending',
      cryptoAmount: cryptoAmount,
    });

    // saving the payment object
    await deposit.save();

    // generating the transaction object
    const transact = {
      amount: deposit.amount,
      description: 'Initiated crypto deposit',
      sign: '',
      author: req.user._id,
      _id: new mongoose.Types.ObjectId(),
    };

    const transaction = new Transaction(transact);

    await transaction.save();

    // adding the transaction and payment to the user object
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          payments: {
            paymentId: deposit._id,
          },
          $position: 0,
        },
      }
    );
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          transactions: {
            transactionId: transaction._id,
          },
          $position: 0,
        },
      }
    );

    // returning a response
    res.json({
      status: true,
      message: 'Crypto deposit initiated',
      data: {
        address: address,
        cryptoAmount: cryptoAmount,
        amount: body.amount,
        rate: rate,
      },
    });

    return;
  } catch (error) {
    console.log(error);
    error = 'Crypto deposit failed';
    res.json({
      status: false,
      error: error,
    });
    return;
  }
};

module.exports = { sendCash, buyCoins, cryptoDeposit };
