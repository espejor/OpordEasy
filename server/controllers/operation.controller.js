// const operation = require('../models/operation');
const { response } = require('express');
const { Query } = require('mongoose');
const operation = require('../models/operation');
const OperationModel = require('../models/operation')
const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectID;

// Creamos un objeto de controlador de operaciones
const operationCtrl = {};

// Funciones de acceso para operaciones

operationCtrl.getOperations = async (req,res) => {
    const operations = await OperationModel.find()
    .populate("phases.timelines.entities")
    .populate("phases.layout.entity")
    .populate("comboEntities");
    res.json(operations);
}

operationCtrl.getOperation = async (req,res) => {
    const operation = await OperationModel.findById(req.params.id)
    .populate("phases.timelines.entities")
    .populate("phases.layout.entity")
    .populate("comboEntities");
    res.json (operation);
}

operationCtrl.updateOperation = async (req,res) => {
    console.log("id para actualizar " + req.params.id);
    console.log("Operacion " + req.body.name);
    console.log("body  %O" , req.body);
    const operationToDDBB = (req.body);
    var response;
    // const operation = await OperationModel.findById(req.params.id);
    // console.log("-----------TIPO " + typeof req.params.id)
    if (req.params.id !== "undefined"){
        const phase = req.body.phase;
        const entity = req.body.entity;
        if(entity)
            var entityId = ObjectId(req.body.entity._id);
        var query;
        switch (req.body.action) {
            case "updateTimeline":
                const timeline = req.body.timeline;
                query = {[`phases.${phase}.timelines.${timeline}.entities`]: entityId}
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $push : query
                })
                console.log(response);
                break;

            // case "newTimeline":
            //     const timeline = req.body.timeline;
            //     query = {[`phases.${phase}.timelines.${timeline}`]: entityId}
            //     response = await OperationModel.updateOne({_id : req.params.id},{
            //         $push : query
            //     })
            //     console.log(response);
            //     break;

            case "updateLayout":
                const location = req.body.location;
                const object = {"entity":entityId,"location":location}
                query = {[`phases.${phase}.layout`]: object}
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $push : query
                })
                console.log(response);
                break;        

            case "updatePosition":
                const locationE = req.body.location;
                console.log("updatePosition");
                query = {[`phases.${phase}.layout.$[ett].location`]: locationE}
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $set : query
                },
                    {arrayFilters: [{"ett.entity" : entityId}]
                })
                console.log(response);
                break;

            case "updateCombo":
                query = {
                    [`comboEntities`]: entityId,
                }
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $push : query
                })
                console.log(response);
                break;

            case "updateOperation":

            default:
                response = await OperationModel.updateOne({_id : req.params.id},req.body.operation)
                console.log(response);
                
                break;
        }
        // if (req.body.action == "updateTimeline"){
        //     const phase = req.body.phase;
        //     const timeline = req.body.timeline;
        //     const entityId = ObjectId(req.body.entityId);
        //     const query = {[`phases.${phase}.timelines.${timeline}.entities`]: entityId}
        //     response = await OperationModel.updateOne({_id : req.params.id},{
        //         $push : query
        //     })
        // }else{
        //     response = await OperationModel.updateOne({_id : req.params.id},operationToDDBB).exec((error,result) => {
        //         if(error){
        //             console.log(error)
        //         }
        //         if(result){
        //             console.log("Success")
        //         }
        //     });
        //     console.log(response);
        // }
    }else{
        console.log("--------------------SAVE")
        response = await new OperationModel(operationToDDBB.operation).save();
        console.log(response);
    }
//    await OperationModel.findOneAndUpdate({_id : req.params.id},{$set: req.body},{new : true, upsert: true}).exec();
    res.json (response);
}


operationCtrl.deleteOperation = async (req,res) => {
    const operation = await OperationModel.findByIdAndDelete(req.params.id);
    
    res.json ({status:'elimina una operación '});
}

operationCtrl.createOperation = async (req,res) => {
    // const operation = ;
    const response = await new OperationModel(req.body).save();
    res.json (response);
}


function prepareOperationToDDBB(operation) {
    for (let phase of operation.phases){
        for (let timeline of phase.timelines){
            for (let entity of timeline.entities){
                entity = mongoose.Types.ObjectId(entity.entity._id); 
            }
        }
        for(let entity of phase.layout){
            entity = mongoose.Types.ObjectId(entity.entity._id); 
        }
    }
    for (let entity of operation.comboEntities){
        entity = mongoose.Types.ObjectId(entity._id); 
    }
    return operation
}

module.exports = operationCtrl;