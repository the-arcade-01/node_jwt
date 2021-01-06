const cookieParser = require('cookie-parser');
const express = require('express');

// express app
const app = express();

// for using .env info
require('dotenv').config({path:'./config/config.env'});

const connectDB = require('./config/db');
const { checkUser, requireAuth } = require('./middleware/authMiddleware');

// db connectivity
connectDB();

// view engine
app.set('view engine','ejs');

// parse data in json format which comes from request
app.use(express.urlencoded({ extended: false}));

app.use(express.json());


// for parsing cookie
app.use(cookieParser());

// static files
app.use(express.static('public'));

// all pages check user
app.get('*',checkUser);

// home route
app.get('/',(req,res)=>{
    res.render('home');
})
// protected page
app.get('/page',requireAuth,(req,res)=>{
    res.render('page');
});
// import auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/',authRoutes);

app.listen(5000,()=>console.log('Server in running on port 5000'));