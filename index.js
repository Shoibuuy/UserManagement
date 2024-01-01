const mongoose = require('mongoose');
 require('dotenv').config();
 const port = process.env.PORT

mongoose.connect('mongodb://127.0.0.1:27017/user_management-system');

const express = require('express');
const app = express();

const nocache = require('nocache');


// for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

// for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

app.listen(port,function(){
    console.log(`Server is Running On http://localhost:${port}`);
});

