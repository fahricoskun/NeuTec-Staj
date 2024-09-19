const express = require("express");
const productController = require("../controllers/productController");
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(productController.getAllProducts);
router.route("/edit/:slug").get(
  authMiddleware("admin"), // Rol doğrulama middleware'i
  productController.getEditPage
);
router.route("/:slug").get(productController.getProduct);
router
  .route("/")
  .post(roleMiddleware(["user", "admin"]), productController.createProduct);
router.route("/:slug").put(productController.updateProduct);
router.route("/:slug").delete(productController.deleteProduct);

module.exports = router;
