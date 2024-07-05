const express = require('express');
const router = express.Router();
//------------------------------------------------
const mongoose = require('mongoose');
require('../models/Posts.js');
const Post = mongoose.model('posts');
//------------------------------------------------
    //Admin routes:
        router.get('/',(req,res)=>{
            res.render('admin/adminMain');
        });

        router.get('/create',(req,res)=>{
            res.render('admin/createPost');
        });

        router.post('/create/new', async (req,res)=>{
            //Verificações
            let erros = [];

            if(!req.body.name || req.body.name == undefined || req.body.name == '' || req.body.name == null){
                erros.push({message: 'Nome inválido'});
            };

            if(!req.body.content || req.body.content == undefined || req.body.content == '' || req.body.content == null){
                erros.push({message: 'Conteúdo inválido'});
            };

            if(erros.length > 0){
                res.render('admin/createPost',{erros: erros});
            } else {
                const post = {
                    name: req.body.name,
                    description: req.body.description,
                    content: req.body.content
                };

                //Salvando postagem
                await new Post(post).save()
                    .then(()=>{
                        req.flash('success_msg','Postagem salva com sucesso');
                        res.redirect('/admin');
                    })
                    .catch((err)=>{
                        req.flash('error_msg','Erro ao salvar postagem');
                        res.redirect('/admin/create');
                    });
            };
        });

        router.get('/modify',(req,res)=>{
            Post.find().sort({date: 'desc'})
                .then((posts)=>{
                    res.render('admin/modifyPosts', {posts: posts});
                })
                .catch((err)=>{
                    req.flash('error_msg','Erro ao carregar as postagens');
                    res.redirect('/admin');
                });
        });

        router.get('/modify/edit/:id',(req,res)=>{
            Post.findOne({_id: req.params.id})
                .then((post)=>{
                    res.render('admin/editPost', {post: post});
                })
                .catch((err)=>{
                    req.flash('error_msg','Houve um erro ao carregar a página de edição');
                    res.redirect('/admin/modify');
                });
        });

        router.post('/modify/edit/saving', async (req,res)=>{
            //Verificações
            let erros = [];

            if(!req.body.name || req.body.name == undefined || req.body.name == '' || req.body.name == null){
                erros.push({message: 'Nome inválido'});
            };

            if(!req.body.content || req.body.content == undefined || req.body.content == '' || req.body.content == null){
                erros.push({message: 'Conteúdo inválido'});
            };

            if(erros.length > 0){
                res.render('admin/modify',{erros: erros});
            } else {
                await Post.findOne({_id: req.body.id})
                    .then((post)=>{
                        post.name = req.body.name;
                        post.description = req.body.description;
                        post.content = req.body.content;

                        post.save()
                            .then(()=>{
                                req.flash('success_msg','Postagem editada com sucesso');
                                res.redirect('/admin/modify');
                            })
                            .catch((err)=>{
                                req.flash('error_msg','Erro interno ao salvar postagem');
                                res.redirect('/admin/modify');
                            })
                    })
                    .catch((err)=>{
                        req.flash('error_msg','Houve um erro ao editar postagem');
                        res.redirect('/admin/modify');
                    });
            };
        });

        router.post('/modify/delete',(req,res)=>{
            Post.deleteOne({_id: req.body.id})
                .then(()=>{
                    req.flash('success_msg','Postagem deletada com sucesso');
                    res.redirect('/admin/modify');
                })
                .catch((err)=>{
                    req.flash('error_msg','Houve um erro ao deletar postagem');
                    res.redirect('/admin/modify');
                });
        });
//------------------------------------------------
module.exports = router;