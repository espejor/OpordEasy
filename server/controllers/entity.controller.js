// const entity = require('../models/entity');
// const { response } = require('express');
// const { Query } = require('mongoose');
const EntityModel = require('../models/entity')

// Creamos un objeto de controlador de operaciones
const entityCtrl = {};

// Funciones de acceso para operaciones

entityCtrl.getEntities = async (req,res) => {
    const entities = await EntityModel.find();
    res.json(entities);
}

entityCtrl.getEntity = async (req,res) => {
    const entity = await EntityModel.findById(req.params.id);
    res.json (entity);
}

// entityCtrl.updateEntity = () => {
//     console.log("Hemos llegado"); 
// }

entityCtrl.updateEntity = async (req,res) => {
    console.log("id para actualizar " + req.params.id);
    // console.log("Entidad " + req.body.name);
    // const entity = await EntityModel.findById(req.params.id);
    console.log("-----------BODY " + req.body)
    if (req.params.id !== "undefined"){
        console.log("--------------------UPDATE")
        const response = await EntityModel.updateOne({_id : req.params.id},{$set: req.body});
        res.json(response)
    }else{
        console.log("--------------------SAVE")
        const response = await new EntityModel(req.body).save();
        res.json (response);
    }
//    await EntityModel.findOneAndUpdate({_id : req.params.id},{$set: req.body},{new : true, upsert: true}).exec();
    // res.json (response);
}


entityCtrl.deleteEntity = async (req,res) => {
    const entity = await EntityModel.findByIdAndDelete(req.params.id);
    
    res.json ({status:'elimina una entidad '});
}

entityCtrl.createEntity = async (req,res) => {
    // const entity = new EntityModel(req.body);
    console.log("-----BODY: " + req.body);
    const response = await new EntityModel(req.body).save();
    console.log("-----RESPONSE: " + response);
    res.json (response);
}



module.exports = entityCtrl;