const express = require('express');
const router = express.Router();
//------------------------------------------------
    //Client routes:
        router.get('/main',(req,res)=>{
            res.render('user/index');
        });
    //Admin routes:

    //Register routes:
        router.get('/register',(req,res)=>{
            res.render('user/register');
        });

        router.post('/register/new',(req,res)=>{

        });
    //Sign In routes:
        router.get('/signin',(req,res)=>{
            res.render('user/signin');
        });

        router.post('/signin/verify',(req,res)=>{

        });
//------------------------------------------------
module.exports = router;