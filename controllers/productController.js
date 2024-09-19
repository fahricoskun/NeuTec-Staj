const Product = require("../models/Product");
const path = require("path");
const fs = require("fs");

//! req.params ile "/products/:id" burada gönderilen id'yi yakaladık
//? tek bir ürünü aldık
exports.getProduct = async (req, res) => {
  try {
    // console.log("Route accessed with ID:", req.params.id); // Bu satır çalışıyor mu?
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      console.log("Ürün bulunamadı");
      return res.status(404).send("Ürün bulunamadı");
    }

    res.render("product", {
      product,
    });
  } catch (error) {
    console.error("Hata oluştu:", error);
    res.status(500).send("Sunucu hatası");
  }
};

exports.getAllProducts = async (req, res) => {
  const page = req.query.page || 1; //!kullanıcının hangi sayfada olduğunu alırız, eğer page değeri yoksa ilk sayfadadır deriz yani 1
  const productPerPage = 12; //! her pagede kaç ürün gösterelim
  
  const totalProduct = await Product.find().countDocuments(); //! veritabanımızda kaç ürün varsa onu döndürür
  const product = await Product.find({})
    .sort("-dateCreated")
    .skip((page - 1) * productPerPage)
    .limit(productPerPage);
    
  res.render("products", {
    page_name: "products",
    product: product,
    current: page,
    totalProduct,
    pages: Math.ceil(totalProduct / productPerPage), //! çıkan sonucu bir üste yuvarlar 2,5 ise 3
  });
};

// add.ejs action="/products" yönlendirmesini burada yakalıyorum
exports.createProduct = async (req, res) => {
  console.log(req.body);
  const uploadDir = "public/uploads";
  //!senkron kullanmamızın nedeni - önce dosya var mı yok mu kontrol et ondan sonra aşağıdaki işlemlere devam et
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  //!req.files ile yüklediğim görsel bilgilerine ulaşabilirim
  let uploadedImage = req.files.image;

  //! public klasörünün içinde upload şeklinde bir klasör olmasını istiyorum ve bu uploadPath yüklediğim resmin yolunu tutacak
  let uploadPath = __dirname + "/../public/uploads/" + uploadedImage.name;

  //! burda da yüklemesini istediğim klasöre mv-move edicek yani taşıyacak
  uploadedImage.mv(uploadPath, async () => {
    await Product.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
};

exports.getEditPage = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  res.status(200).render("edit", {
    page_name: "edit",
    product,
  });
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Ürün bulunamadı." });
    }

    product.name = req.body.name;
    product.description = req.body.description;

    // Eğer yeni bir görsel yüklendiyse, mevcut görseli güncelle
    if (req.files && req.files.image) {
      // Eski görseli sil
      if (product.image) {
        const oldImagePath = path.join(
          __dirname,
          "/../public/uploads",
          path.basename(product.image)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const uploadedImage = req.files.image;
      const uploadPath = path.join(
        __dirname,
        "/../public/uploads",
        uploadedImage.name
      );
      uploadedImage.mv(uploadPath, (err) => {
        if (err)
          return res.status(500).json({ status: "fail", error: err.message });

        product.image = "/uploads/" + uploadedImage.name;
        product.save();
        res.redirect("/products");
      });
    } else {
      // Görsel güncellenmemişse, sadece diğer alanları güncelle
      await product.save();
      res.redirect("/products");
    }
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    // Ürünü slug ile bul
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).send("Ürün bulunamadı");
    }

    // Silinecek dosyanın yolunu oluştur
    const deletedImagePath = path.join(__dirname, "../public", product.image);

    // Dosya mevcutsa sil
    if (fs.existsSync(deletedImagePath)) {
      fs.unlinkSync(deletedImagePath);
    } else {
      console.error("Dosya bulunamadı:", deletedImagePath);
    }

    // Ürünü slug ile sil
    await Product.findOneAndDelete({ slug: req.params.slug });

    // Ana sayfaya yönlendir
    res.redirect("/");
  } catch (error) {
    console.error("Hata oluştu:", error);
    res.status(500).send("Sunucu hatası");
  }
};
