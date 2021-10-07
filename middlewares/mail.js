// importing the required modules
const { User } = require('../models/user');
const { Nodemailing } = require('nodemailing');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { readFile } = require('fs');
const handlebars = require('handlebars');
const path = require('path');

class Mail {
  constructor() {
    //   defining the class attributes
    this.username = process.env.EMAIL_USERNAME;
    this.password = process.env.EMAIL_PASSWORD;
    this.host = process.env.EMAIL_HOST;
    this.admin = process.env.ADMIN_EMAIL;

    // computing the path to the email HTML files
  }

  // helper function for sending OTP to user
  async mailOTP(user, otp) {
    // computing the email object
    const msg = {
      Host: this.host,
      Username: this.username,
      Password: this.password,
      To: user.email,
      From: this.adminOrder,
      Subject: `OTP To Complete Login`,
      Body: `<p>Hello ${user.firstName},</p><p>Find below your OTP to complete your login</p><p>${otp}</p>`,
    };

    // sending the mail
    return new Promise((resolve, reject) => {
      Nodemailing.send(msg)
        .then((status) => {
          resolve(status);
        })
        .catch((error) => {
          reject(error);
          return;
        });
    });
  }
}

module.exports = { Mail };
