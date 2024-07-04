const express = require('express');
const router = express.Router();
//------------------------------------------------
    //Client routes:
        router.get('/main',(req,res)=>{
            res.render('user/index');
        });

        router.get('/main/login', (req,res)=>{
            res.render('user/index');
        });
//------------------------------------------------
module.exports = router;