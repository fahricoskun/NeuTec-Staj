const User = require("../models/User");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect("/login"); // Burada return kullanarak işlemi sonlandırıyoruz
  }
  next(); // Eğer user varsa, bir sonraki middleware'e geç
};

// Kullanıcıyı doğrulama ve rol yetkilendirme middleware'i
module.exports = function authorizeRole(role) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.session.userID);
      if (!user) {
        // Kullanıcı bulunamadıysa login sayfasına yönlendir
        return res.redirect("/login");
      }

      // Kullanıcıyı req.user olarak ata
      req.user = user;

      if (req.user.role === role) {
        // Eğer kullanıcı rolü belirtilen rol ise devam et
        return next();
      } else {
        // Eğer kullanıcı yetkili değilse
        req.flash('error', 'Bu sayfaya erişim yetkiniz yok.');
        return res.redirect('/');
      }
    } catch (error) {
      // Hata durumunda genel hata sayfasına yönlendir
      next(error);
    }
  };
};