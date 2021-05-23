// const operation = require('../models/operation');
const { response } = require('express');
const { Query } = require('mongoose');
const OperationModel = require('../models/operation')

// Creamos un objeto de controlador de operaciones
const operationCtrl = {};

// Funciones de acceso para operaciones

operationCtrl.getOperations = async (req,res) => {
    const operations = await OperationModel.find();
    res.json(operations);
}

operationCtrl.getOperation = async (req,res) => {
    const operation = await OperationModel.findById(req.params.id);
    res.json (operation);
}

operationCtrl.updateOperation = async (req,res) => {
    console.log("id para actualizar " + req.params.id);
    console.log("Operacion " + req.body.name);
    console.log("phases " + req.body.phases);
    // const operation = await OperationModel.findById(req.params.id);
    console.log("-----------TIPO " + typeof req.params.id)
    if (req.params.id !== "undefined"){
        console.log("--------------------UPDATE")
        const response = await OperationModel.updateOne({_id : req.params.id},{$set: req.body});
    }else{
        console.log("--------------------SAVE")
        const response = await new OperationModel(req.body).save();
        res.json (response);
    }
//    await OperationModel.findOneAndUpdate({_id : req.params.id},{$set: req.body},{new : true, upsert: true}).exec();
    // res.json (response);
}


operationCtrl.deleteOperation = async (req,res) => {
    const operation = await OperationModel.findByIdAndDelete(req.params.id);
    
    res.json ({status:'elimina una operación '});
}

operationCtrl.createOperation = async (req,res) => {
    const operation = new OperationModel(req.body);
    const response = await operation.save();
    res.json (response);
}



module.exports = operationCtrl;