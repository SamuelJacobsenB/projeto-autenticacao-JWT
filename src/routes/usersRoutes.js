const express = require('express');
const router = express.Router();
//------------------------------------------------ MONGODB-MONGOOSE-MODEL
const mongoose = require('mongoose');
require('../models/Posts.js');
const Post = mongoose.model('posts');
//------------------------------------------------ ROUTES
    //Client routes:
        router.get('/main',(req,res)=>{
            Post.find().sort({date: 'desc'})
                .then((posts)=>{
                    res.render('user/index', {posts: posts});
                })
                .catch((err)=>{
                    req.flash('error_msg','Erro ao carregar as postagens');
                    res.redirect('/signin');
                });
        });

        //Conteúdo de cada postagem
        router.get('/main/:id',(req,res)=>{
            Post.findOne({_id: req.params.id})
                .then((post)=>{
                    res.render('user/postcontent', {post: post});
                })
                .catch((err)=>{
                    req.flash('error_msg','Esta postagem não existe');
                    res.redirect('/users/main');
                });
        });
//------------------------------------------------
module.exports = router;