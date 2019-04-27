const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Product = require("../models/product");

const authenticationMiddleware = require('./../middlewares/authentication')


router.post("/", (req, res, next) => {
  const {
    name,
    price,
    image,
    description
  } = req.body;
  const product = new Product({
    name,
    price,
    image,
    description
  });
  product.save(err => {
    if (err) return next(createError(400, err));
    res.send(product);
  });
});

router.use(authenticationMiddleware);

router.get("/", (req, res, next) => {
  Product.find({}, function (err, products) {
    if (err) return next(createError(400, err));
    res.send(products);
  });
});



router.delete("/:productId", (req, res, next) => {
  Product.findById(req.params.productId, (err, product) => {
    if (err) return next(createError(400, err));
    product.remove(product, err => {
      if (err) return next(createError(400, err));
    });
    res.send(product);
  });
});



router.get("/:productId", (req, res, next) => {
  Product.findOne({ _id: req.params.productId }, (err, product) => {
    if (err) return next(createError(err, 400));
    res.send(product);
  });
});

module.exports = router;
