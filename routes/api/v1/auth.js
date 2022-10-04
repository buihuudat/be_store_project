const router = require("express").Router();
const { body } = require("express-validator");
const validation = require("../../../handler/validation");
const User = require("../../../models/user");
const authController = require("../../../controllers/auth");
const token = require("../../../handler/token");

router.post(
  "/signin",
  body("phone")
    .trim()
    .custom((value) => {
      return User.findOne({ phone: value }).then((user) => {
        if (!user) {
          return Promise.reject("incorrect phone or password");
        }
      });
    }),
  validation,
  authController.signin
);

router.post(
  "/signup",
  body("phone")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number"),
  body("password")
    .trim()
    .isLength({ nim: 8 })
    .withMessage("Password must be at 8 characters"),
  body("phone")
    .trim()
    .custom((value) => {
      return User.findOne({ phone: value }).then((user) => {
        if (user) {
          return Promise.reject("Phone has been use");
        }
      });
    }),
  validation,
  authController.signup
);

router.post("/verify-token", token.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});
module.exports = router;
