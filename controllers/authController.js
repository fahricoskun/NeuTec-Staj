const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const User = require("../models/User");

exports.createUser = async (req, res) => {
    try {
        // req.body'den gelen role bilgisini atlayıp varsayılan olarak "user" rolünü belirleyin
        const { name, email, password } = req.body;
        const role = 'user'; // Otomatik olarak "user" rolünü atıyoruz

        // Yeni kullanıcıyı oluştur
        const user = await User.create({ name, email, password, role });

        // Başarı durumunda login sayfasına yönlendir
        res.status(201).redirect("/login");
    } catch (error) {
        // Hata durumunda doğrulama hatalarını işleme
        const errors = validationResult(req);

        // Hata mesajlarını flash olarak ayarla
        errors.array().forEach(error => req.flash("error", error.msg));

        // Kayıt formuna yönlendir
        res.status(404).redirect("/register");
    }
};

exports.loginUser = async (req, res) => {
    try {
        // Kullanıcının girdiği email ve passwordu almak
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    // Kullanıcı session
                    req.session.userID = user._id; // Hangi kullanıcı giriş yapmış
                    console.log("User connected with ID:", req.session.userID); // Bu satır çalışıyor mu?
                    res.status(200).redirect("/");
                } else {
                    req.flash("error", "Şifre yanlış!");
                    res.status(404).redirect("/login");
                }
            });
        } else {
            req.flash("error", "Kullanıcı bulunamadı!");
            res.status(404).redirect("/login");
        }
    } catch (error) {
        res.status(404).json({
            status: "fail",
            error,
        });
    }
};

exports.logoutUser = (req, res) => {
    console.log("User disconnected with ID:", req.session.userID); // Bu satır çalışıyor mu?
    req.session.destroy(() => {
        res.redirect("/");
    });
};