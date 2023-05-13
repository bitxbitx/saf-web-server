const mongoose = require('mongoose');
const ProductCategory = require('../models/ecom/productCategory.model');

mongoose.connect('mongodb+srv://userzhen:userzhen@cluster0.iu35yn2.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to the database!');

    const testData = [
        {
          name: "Handbags",
          description: "Luxury handbags",
          image: "https://example.com/handbags.jpg",
        },
        {
          name: "Shoes",
          description: "Luxury shoes",
          image: "https://example.com/shoes.jpg",
        },
        {
          name: "Watches",
          description: "Luxury watches",
          image: "https://example.com/watches.jpg",
        },
        {
          name: "Jewelry",
          description: "Luxury jewelry",
          image: "https://example.com/jewelry.jpg",
        },
        {
          name: "Clothing",
          description: "Luxury clothing",
          image: "https://example.com/clothing.jpg",
        },
        {
          name: "Eyewear",
          description: "Luxury eyewear",
          image: "https://example.com/eyewear.jpg",
        },
        {
          name: "Perfumes",
          description: "Luxury perfumes",
          image: "https://example.com/perfumes.jpg",
        },
        {
          name: "Accessories",
          description: "Luxury accessories",
          image: "https://example.com/accessories.jpg",
        },
        {
          name: "Home",
          description: "Luxury home goods",
          image: "https://example.com/home.jpg",
        },
        {
          name: "Fragrances",
          description: "Luxury fragrances",
          image: "https://example.com/fragrances.jpg",
        }
      ]
      
    // insert data into database
    ProductCategory.insertMany(testData, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Multiple documents inserted to Collection");
        }
    })


});
