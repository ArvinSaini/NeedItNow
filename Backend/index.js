const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {connectToMongoDB} = require("./connect");
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const requestRoute = require('./routes/request');
const adminRoute = require('./routes/admin');

const app = express();
const PORT = process.env.PORT;

// connection
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/request', requestRoute);
app.use('/admin', adminRoute);

app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`);
});
