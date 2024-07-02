const express = require('express');
const app = express();
app.use(express.json());
//------------------------------------------------
require('dotenv').config();
const PORT = process.env.PORT;
const DB_PASSOWORD = process.env.DB_PASSOWORD;
const DB_ADMINUSER = process.env.DB_ADMINUSER;
const SESSION_SECRET = process.env.SESSION_SECRET;
//------------------------------------------------
const session = require('express-session');
const flash = require('connect-flash');
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
//------------------------------------------------
const path = require('path');

//------------------------------------------------
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//------------------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//------------------------------------------------
const dbURL = `mongodb+srv://${DB_ADMINUSER}:${DB_PASSOWORD}@loginproject.muj8ixh.mongodb.net/?retryWrites=true&w=majority&appName=loginProject`;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbURL)
    .then(()=>{
        console.log('MongoDB databases was connected...');
    }).catch((err)=>{
        console.error('MongoDB databases was not connected!!!')
    });
//------------------------------------------------
const router = require('./routes/routes.js');
app.use('/',router);
//------------------------------------------------
app.listen(PORT,()=>{
    console.log('Server started...');
});