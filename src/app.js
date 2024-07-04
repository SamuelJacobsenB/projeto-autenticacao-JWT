const express = require('express');
const app = express();
//------------------------------------------------ / DOTENV
require('dotenv').config();
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;
const DB_URL = process.env.DB_URL;
//------------------------------------------------ / SESSION
const session = require('express-session');
const flash = require('connect-flash');
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
//------------------------------------------------ / FLASH
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
//------------------------------------------------ / COOKIE-PARSER
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cookieJwtAuth = require('./config/cookieJwtAuth.js');
//------------------------------------------------ / CSS-JS
const path = require('path');
app.use(express.static(path.join(__dirname,'public')));
//------------------------------------------------ / HANDLEBARS
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//------------------------------------------------ / BODY-PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//------------------------------------------------ / MONGODB-MONGOOSE
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL)
    .then(()=>{
        console.log('MongoDB databases was connected...');
    })
    .catch((err)=>{
        console.error('MongoDB databases was not connected!!!')
    });
//------------------------------------------------ / ROUTES
const authenticateRoutes = require('./routes/authenticateRoutes.js');
const usersRoutes = require('./routes/usersRoutes.js');
app.use('/',authenticateRoutes);
app.use('/users', cookieJwtAuth, usersRoutes);
//------------------------------------------------ / PORT
app.listen(PORT,()=>{
    console.log('Server started...');
});