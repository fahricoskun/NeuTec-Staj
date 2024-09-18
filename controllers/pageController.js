const Product = require("../models/Product");
const User = require("../models/User");

//! ana sayfada en son yüklenen en başa gelsin diye sort() kullandık onu da dateCreated ile
//! sıraladık başına - koyduk
//? bütün fotoğrafları aldık
exports.getIndexPage = async (req, res) => {
  const totalUser = await User.countDocuments({role: "user"});
  const page = req.query.page || 1; //!kullanıcının hangi sayfada olduğunu alırız, eğer page değeri yoksa ilk sayfadadır deriz yani 1
  const productPerPage = 3; //! her pagede kaç foto gösterelim 

  const totalProduct = await Product.find().countDocuments(); //! veritabanımızda kaç foto varsa onu döndürür
  const product = await Product.find({})
  .sort("-dateCreated")
  .skip((page - 1) * productPerPage) //! notlara bak -skip()
  .limit(productPerPage) //!her sayfada kaç gösterilmesini isteriz onu belirledik limit ile

  res.render("index", {
    page_name: "index",
    product: product,
    current: page,
    totalUser,
    totalProduct,
    pages: Math.ceil(totalProduct / productPerPage) //! çıkan sonucu bir üste yuvarlar 2,5 ise 3
  });
};

// exports.getProductPage = async (req, res) => {
//   const product = await Product.find({});
//   res.render("products", {
//     page_name: "product",
//     product: product,
//   });
// }

exports.getAddPage = (req, res) => {
  res.status(200).render("add", {
    page_name: "add",
  });
};

// exports.getEditPage = async (req, res) => {
//   const product = await Product.findOne({ _id: req.params.id });
//   res.status(200).render("edit", {
//     page_name: "edit",
//     product,
//   });
// };

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};