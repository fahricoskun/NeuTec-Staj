const express = require("express");
const authController = require("../controllers/authController");
const { body, validationResult } = require('express-validator');
const User = require("../models/User")

const router = express.Router();

router.route("/signup").post(
    [
        body("name").not().isEmpty().withMessage("Lütfen bir isim girin!"),
        body("email").isEmail().withMessage("Lütfen bir email girin!")
            .custom(async (userEmail) => {
                const user = await User.findOne({ email: userEmail });
                if (user) {
                    return Promise.reject("Bu Email zaten kullanılıyor!");
                }
            }),
        body("password").not().isEmpty().withMessage("Lütfen bir şifre girin!"),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Hataları flash mesaj olarak ayarla
            req.flash('error', errors.array().map(error => error.msg));
            return res.redirect('/register');
        }

        // Eğer hata yoksa, createUser fonksiyonunu çağır
        try {
            await authController.createUser(req, res);
        } catch (error) {
            next(error); // Hata durumunda hata yönetim middleware'ine geç
        }
    }
);
 // http://localhost:3000/users/signup linkine gider "/" ise bu linke git demek aslında
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
// router.route("/dashboard").get(authMiddleware, authController.getDashboardPage); //http://localhost:3000/users/dashboard //! authMiddleware ok ise ondan sonra getDashboardPage çalıştır
// router.route("/:_id").delete(authController.deleteUser);

module.exports = router;