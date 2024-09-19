const express = require("express");
const pageController = require("../controllers/pageController");
const redirectMiddleware = require("../middlewares/redirectMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/add").get(authMiddleware("admin"), pageController.getAddPage);
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);
router.route("/register").get(pageController.getRegisterPage);

module.exports = router;
