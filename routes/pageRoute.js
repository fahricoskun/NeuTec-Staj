const express = require("express");
const pageController = require("../controllers/pageController");
const redirectMiddleware = require("../middlewares/redirectMiddleware");

const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/add").get(pageController.getAddPage);
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);
router.route("/register").get(pageController.getRegisterPage);

module.exports = router;
