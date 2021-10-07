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

// sendCash webhook controller
const sendCash = async (req, res) => {
  res.status(200);
};

module.exports = { sendCash };
