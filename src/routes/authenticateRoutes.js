const express = require('express');
const router = express.Router();
//------------------------------------------------ MONGODB-MONGOOSE-MODEL
const mongoose = require('mongoose');
require('../models/User.js');
const User = mongoose.model('users');
//------------------------------------------------ BCRYPT-PASSWORD
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//------------------------------------------------ DOTENV
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
//------------------------------------------------ ROUTES
    //Register routes:
        router.get('/register',(req,res)=>{
            res.render('user/register');
        });

        router.post('/register/new',async (req,res)=>{
            //Verificações
            let erros = [];

            if(!req.body.name || req.body.name == undefined || req.body.name == '' || req.body.name == null){
                erros.push({message: 'Nome inválido'});
            };

            if(!req.body.surname || req.body.surname == undefined || req.body.surname == '' || req.body.surname == null){
                erros.push({message: 'Sobrenome inválido'});
            };

            if(!req.body.email || req.body.email == undefined || req.body.email == '' || req.body.email == null){
                erros.push({message: 'Email inválido'});
            };

            const findEmails = await User.findOne({email: req.body.email});

            if(findEmails){
                erros.push({message: 'Email já cadastrado'});
            };

            if(!req.body.password || req.body.password == undefined || req.body.password == '' || req.body.password == null){
                erros.push({message: 'Senha inválido'});
            };

            if(req.body.password.length < 8){
                erros.push({message: 'Senha deve ter no mínimo 8 caracteres'});
            };

            if(req.body.password != req.body.verifypassword){
                erros.push({message: 'Senhas diferentes'});
            };

            if(erros.length > 0){
                res.render('user/register',{erros: erros});
            } else {
                //hasheando senha
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = await bcrypt.hash(req.body.password, salt);

                const user = {
                    _id: this._id,
                    name: req.body.name + ' ' + req.body.surname,
                    email: req.body.email,
                    password: hashPassword
                };

                //registrando usuário
                await new User(user).save()
                    .then((user)=>{
                        const token = jwt.sign({user: user._id}, JWT_SECRET, {expiresIn: 7200});
                        res.cookie('token', token, {httpOnly: true});

                        req.flash('success_msg','Conta salva com sucesso');
                        res.redirect('/users/main');
                    })
                    .catch((err)=>{
                        req.flash('error_msg','Erro interno ao salvar sua conta');
                        res.redirect('/register');
                    });
            };
        });
    //Sign In routes:
        router.get('/signin',(req,res)=>{
            res.render('user/signin');
        });

        router.post('/signin/verify',async (req,res)=>{
            //Verificações
            let erros = [];

            if(!req.body.email || req.body.email == undefined || req.body.email == '' || req.body.email == null){
                erros.push({message: 'Email inválido'});
            };

            const user = await User.findOne({email: req.body.email});

            if(!user){
                erros.push({message: 'Email não cadastrado'});
            };

            if(!req.body.password || req.body.password == undefined || req.body.password == '' || req.body.password == null){
                erros.push({message: 'Senha inválido'});
            };

            if(req.body.password.length < 8){
                erros.push({message: 'Senha deve ter no mínimo 8 caracteres'});
            };

            if(erros.length > 0){
                res.render('user/signin',{erros: erros});
            } else {
                //Comparando senhas
                const isValidPassword = await bcrypt.compare(req.body.password, user.password);

                if(isValidPassword == true){
                    //Criação do token e verificação de usuário admin
                    if(user.userType == 0){
                        const token = jwt.sign({user: user._id}, JWT_SECRET, {expiresIn: 7200});
                        res.cookie('token', token, {httpOnly: true});

                        req.flash('success_msg','Usuário logado com sucesso');
                        res.redirect('/users/main');
                    } else {
                        const token = jwt.sign({user: user._id, userType: user.userType}, JWT_SECRET, {expiresIn: 7200});
                        res.cookie('token', token, {httpOnly: true});

                        req.flash('success_msg','Usuário administrador logado com sucesso');
                        res.redirect('/admin');
                    };
                } else {
                    req.flash('error_msg','Senha incorreta, tente novamente');
                    res.redirect('/signin');
                };
            };
        });
//------------------------------------------------
module.exports = router;