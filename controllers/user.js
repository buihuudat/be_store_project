const co = require("co");
const CryptoJS = require("crypto-js");
const User = require("../models/user");

module.exports = {
  update: (req, res) => {
    const { _id, phone, password } = req.body;
    co(function* () {
      const isPhone = yield User.findOne({ phone: req.body.phone });
      if (isPhone && isPhone.phone !== phone) {
        return Promise.reject({
          errors: [
            {
              param: "phone",
              msg: "Phone already use",
            },
          ],
        });
      }
      if (password !== isPhone.password) {
        req.body.password = CryptoJS.AES.encrypt(
          password,
          process.env.PASSWORD_SECRET_KEY
        );
      }
      const user = yield User.findByIdAndUpdate(_id, req.body);
      return user;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },
  delete: (req, res) => {
    const { _id } = req.body;
    co(function* () {
      yield User.findByIdAndDelete(_id);
      const users = yield User.find();
      return users;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },
  getAll: (req, res) => {
    co(function* () {
      const users = yield User.find();
      return users;
    })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json(err));
  },
};
