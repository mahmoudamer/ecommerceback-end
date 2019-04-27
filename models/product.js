const mongoose = require("mongoose")

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    }

});

var product = mongoose.model('products', productSchema);

module.exports = product;