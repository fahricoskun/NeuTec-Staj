const User = require("../models/User");

module.exports = (roles) => {
    return async (req, res, next) => {
        const user = await User.findById(req.session.userID); // Kullanıcı veritabanından bulunur
        if (user && roles.includes(user.role)) { // Kullanıcının rolü veritabanındaki rolüne göre kontrol edilir
            next();
        } else {
            return res.status(403).send("You don't have permission to do this.");
        }
    }
}
