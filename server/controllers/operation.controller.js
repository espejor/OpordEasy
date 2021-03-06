// const operation = require('../models/operation');
// const { response } = require('express');
// const { Query } = require('mongoose');
// const operation = require('../models/operation');
const OperationModel = require('../models/operation')
const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const UserModel = require('../models/user')

// Creamos un objeto de controlador de operaciones
const operationCtrl = {};

// Funciones de acceso para operaciones

operationCtrl.getOperations = async (req,res) => {
    const operations = await OperationModel.find()
    .populate("phases.timelines.entities")
    .populate("phases.layout.entity")
    .populate("comboEntities")
    .populate("users.user");
    res.json(operations);
}

operationCtrl.getOperationsForUser = async (req,res) => {
    const operations = await OperationModel.find({
       ["users.user"]: {"$eq": [req.params.id]}
    })
    .populate("phases.timelines.entities")
    .populate("phases.layout.entity")
    .populate("comboEntities")
    .populate("users.user");
    res.json(operations);


    
    // const operationsList = [];
    // const ops = await UserModel.findById (req.params.id,"operations",(error,user) =>{
    //     user.operations.forEach(operationObjectId =>{
    //         const operation = OperationModel.findById(operationObjectId.toString())
    //         .populate("phases.timelines.entities")
    //         .populate("phases.layout.entity")
    //         .populate("comboEntities")
    //         .populate("users");
    //         operationsList.push(res.json(operation))
    //     })
    // }).clone()
    // res.json(operationsList)
}

operationCtrl.getOperation = async (req,res) => {
    const operation = await OperationModel.findById(req.params.id)
    .populate("phases.timelines.entities")
    .populate("phases.layout.entity")
    .populate("comboEntities")
    .populate("users.user");
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
        var location
        var entity
        var reference
        if(req.body.entity){
            if(req.body.entity.entity){     // es una EntitytLocated
                entity = req.body.entity.entity;
                location = req.body.entity.location;
            }else{
                entity = req.body.entity;
                location = req.body.location;
            }
            reference = ObjectId(entity._id)
        }
        var object
        var entityId
        if(entity){
            entityId = ObjectId(entity._id);
            object = {"entity":entityId,"location":location}
            objectRef = {"entity":reference,"location":location}
        }
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

            case "updateUsersDB":
                const users = req.body.users
                // users.forEach(user => {
                //     user.user = ObjectId(user.user) 
                // });
                query = {
                    [`users`]: users,
                }
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $set : query
                })
                console.log(response);
                break;

            case "updateLayout":
                query = {[`phases.${phase}.layout`]: object}
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $push : query
                })
                console.log(response);
                break;      


            case "updatePosition":
                // const locationE = req.body.location;
                console.log("updatePosition");
                query = {[`phases.${phase}.layout.$[ett].location`]: location}
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $set : query
                },
                    {arrayFilters: [{"ett.entity" : entityId}]
                })
                console.log(response);
                break;

            case "updateEntity":
                // const entityE = req.body.entity;
                console.log("updateEntity");
                query = {[`phases.${phase}.layout.$[ett].entity`]: entity}
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $set : query
                },
                    {arrayFilters: [{"ett.entity" : entityId}]
                })
                console.log(response);
                break;

            case "deleteEntityLyt":
                console.log("deleteEntity");
                query = {[`phases.${phase}.layout`]: {"entity":reference,"location":location}}
                response =  await deleteEntityFromCollection(req.params.id,query)
                console.log(response);
                query = {[`phases.${phase}.timelines.$[tl].entities`]: reference}
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $pull : query},
                    {arrayFilters: [{"tl.entities" : entityId}]
                })
                console.log(response);
                query = {[`comboEntities`]: reference}
                response = await deleteEntityFromCollection(req.params.id,query)
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
                query = {
                    // _id:                ObjectId(req.body.operation._id),
                    comboEntities:      req.body.operation.comboEntities,
                    name:               req.body.operation.name ,
                    phases:             req.body.operation.phases,
                    situation:          req.body.operation.situation,
                    updated:            req.body.operation.updated,
                    mission:            req.body.operation.mission,
                    order:              req.body.operation.order,
                    enemy:              req.body.operation.enemy,
                    ourForces:          req.body.operation.ourForces,
                    aggregationsAndSegregations: req.body.operation.aggregationsAndSegregations,
                    coordination:       req.body.operation.coordination,
                    apolog:             req.body.operation.apolog,
                    command:            req.body.operation.command,
                    communications:     req.body.operation.communications
                    
                }
                
                response = await OperationModel.updateOne({_id : req.params.id},{
                    $set : query
                })
                console.log(response);
                
                break;
        }
    }else{
        console.log("--------------------SAVE")
        response = await new OperationModel(operationToDDBB.operation).save();
        console.log(response);
    }
//    await OperationModel.findOneAndUpdate({_id : req.params.id},{$set: req.body},{new : true, upsert: true}).exec();
    res.json (response);
}

function deleteEntityFromCollection(id,query) {
    return OperationModel.updateOne({_id : id},{
        $pull : query
    })
}

// function deleteEntityFromTimelines(id,query) {
//     return await OperationModel.updateOne({_id : id},{
//     $pull : query
// })}

operationCtrl.deleteOperation = async (req,res) => {
    const operation = await OperationModel.findByIdAndDelete(req.params.id);
    
    res.json ({status:'elimina una operaci??n '});
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