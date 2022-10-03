const co = require('co')
const CryptoJS = require('crypto-js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = {
  signin: (req, res) => {
    const {phone, password} = req.body
    co (function* () {
      const user = yield User.findOne({phone}).select('password')
      const decryptoPass = CryptoJS.AES.decrypt(
        password,
        process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8)
      if (user.password !== decryptoPass) {
        return Promise.reject("incorrect phone or password")
      }
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "24h",
      });
      return token
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.staus(500).json(err))
  },

  signup: (req, res) => {
    const {phone, password} = req.body
    co (function* () {
      req.body.password = CryptoJS.AES.encrypt(
        password,
        process.env.PASSWORD_SECRET_KEY
      )
      const user = yield User.create(req.body)
      return user
    })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json(err))
  }
}