
// const express = require('express');
const UserModel = require('../models/user')
const mongoose = require('mongoose')
// const ObjectId = require('mongodb').ObjectID;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const app = express();

// Creamos un objeto de controlador de operaciones
const userCtrl = {};


userCtrl.getUsers = async (req,res) => {
    const users = await UserModel.find()
    res.json(users);
}

userCtrl.login = async (req,res) => {
    const user = await UserModel.findOne({ email: req.body.email }, (erro, userDB)=>{
        if (erro) {
          return res.status(500).json({
             ok: false,
             err: erro
          })
       }
    // Verifica que exista un usuario con el mail escrita por el usuario.
      if (!userDB) {
         return res.status(400).json({
           ok: false,
           err: {
               message: "Usuario o contraseña incorrectos"
           }
        })
      }
    // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
      if (! bcrypt.compareSync(req.body.password, userDB.password)){
         return res.status(400).json({
            ok: false,
            err: {
              message: "Usuario o contraseña incorrectos"
            }
         });
      }
    // Genera el token de autenticación
       let token = jwt.sign({
              user: userDB,
           }, process.env.SEED_AUTENTICACION, {
           expiresIn: process.env.CADUCIDAD_TOKEN
       })
       res.json({
           ok: true,
           user: userDB,
           token,
       })
    })
}


userCtrl.register = async (req,res) => {
    let body = req.body;
    let { firstName,lastName, email, password, userName,role } = body;
  
    // let user = await User.findOne({ email });
    //   if (user) return res.status(400).send("User already registered.");

    let user = new UserModel({
      firstName,
      lastName,
      email,
      userName,
      password: bcrypt.hashSync(password, 10),
      role
    });
    const response = await user.save((err, userDB) => {
      if (err) {
        return res.status(400).json({
           ok: false,
           err,
           message:err.message
        });
      }
      res.json({
        ok: true,
        user: userDB
        });
    })
}


module.exports = userCtrl;