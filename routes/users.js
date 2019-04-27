const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const PRODUCT = require("../models/product");


const authenticationMiddleware = require('./../middlewares/authentication')

const USER = require('./../models/user');


// register
router.post('/', async (req, res, next) => {
  try {

    const user = new USER(req.body);
    await user.save();
    res.send(user);
  } catch (err) {
    next(createError(400, err));
  }

});


// log in 
router.post('/login', async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    console.log(req.body);
    if (!userName || !password) throw new Error('missed username or password');
    const user = await USER.findOne({ userName });
    if (!user) throw new Error('wrong username or password');
    const isthesame = await user.verifyPassword(password);
    if (!isthesame) throw new Error('authentication failed');
    const token = await user.generateToken();
    res.send({
      token,
      user
    })
  } catch (err) {
    next(createError(400, err.message))
  }
})

router.use(authenticationMiddleware);

router.get('/profile', (req, res) => {
  res.send(req.user);
})

// router.post('/add', async (req, res, next) => {
//   const product = req.body;
//   const newproduct = new PRODUCT(product)
//   await newproduct.save();
//   res.save(newproduct);

// })




module.exports = router;