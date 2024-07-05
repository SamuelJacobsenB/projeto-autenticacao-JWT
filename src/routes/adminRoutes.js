const express = require('express');
const router = express.Router();
//------------------------------------------------
    //Admin routes:
        router.get('/',(req,res)=>{
            res.send('ola');
        });
//------------------------------------------------
module.exports = router;