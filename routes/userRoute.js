const express = require("express");
const authController = require("../controllers/authController");
const { body } = require('express-validator');
const User = require("../models/User")

const router = express.Router();

router.route("/signup").post(
    [
        body("name").not().isEmpty().withMessage("Lütfen bir isim girin!"),

        body("email").isEmail().withMessage("Lütfen bir email girin!")
        .custom((userEmail) => {
            return User.findOne({email: userEmail}).then(user => {
                if(user) {
                    return Promise.reject("Bu Email zaten kullanılıyor!")
                }
            })
        }),
        body("password").not().isEmpty().withMessage("Lütfen bir şifre girin!"),
    ],
    authController.createUser); // http://localhost:3000/users/signup linkine gider "/" ise bu linke git demek aslında
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
// router.route("/dashboard").get(authMiddleware, authController.getDashboardPage); //http://localhost:3000/users/dashboard //! authMiddleware ok ise ondan sonra getDashboardPage çalıştır
// router.route("/:_id").delete(authController.deleteUser);

module.exports = router;