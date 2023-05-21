const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/error.middleware');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const socketServer = require('./socketServer'); // Import the Socket.io server

const port = process.env.PORT || 8000;

connectDB();

const app = express();

// Morgan
app.use(morgan('dev'));

// Cookie Parser
app.use(cookieParser());

// Cors
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8000', 'https://saf-web-client.vercel.app']; // add any other origins that you want to allow

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true // enable passing cookies from the client to the server
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use(errorHandler);

// Common Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

// Social Routes
app.use('/api/shares', require('./routes/social/share.routes'));
app.use('/api/likes', require('./routes/social/like.routes'));
app.use('/api/comments', require('./routes/social/comment.routes'));
app.use('/api/posts', require('./routes/social/post.routes'));

// Ecommerce Routes
app.use('/api/add-to-cart', require('./routes/ecom/addToCart.routes'));
app.use('/api/orders', require('./routes/ecom/order.routes'));
app.use('/api/products', require('./routes/ecom/product.routes'));
app.use('/api/product-variants', require('./routes/ecom/productVariant.routes'));
app.use('/api/product-categories', require('./routes/ecom/productCategory.routes'));
app.use('/api/promo-codes', require('./routes/ecom/promoCode.routes'));
app.use('/api/shop-location', require('./routes/ecom/shopLocation.routes'));
app.use('/api/wishlist', require('./routes/ecom/wishlist.routes'));

// Statistics Routes
app.use('/api/statistics', require('./routes/statistics/statistics.routes'));

// Fetch Image
app.use('/uploads', express.static('uploads'));

// Temp
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

// Start the Socket.io server
socketServer(server);

module.exports = app;