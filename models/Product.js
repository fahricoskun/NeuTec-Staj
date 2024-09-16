const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

// schema oluşturma
const ProductSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true, // require yerine required olmalı
  },
  description: {
    type: String,
    unique: true,
    required: true, // require yerine required olmalı
  },
  image: {
    type: String,
    unique: true,
    required: true, // require yerine required olmalı
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  }
});

// Slug oluşturma işlemi (sadece name varsa slug oluşturulur)
ProductSchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
})

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
