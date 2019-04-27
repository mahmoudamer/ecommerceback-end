var express = require('express');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');

require('./dbConnection');


var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);


// global error handler
//404
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.send(err);
})

module.exports = app;
