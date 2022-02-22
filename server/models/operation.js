const mongoose = require('mongoose');
const Phase = require('./phase');
const User = require('./user');
const validOpsRoles = require('./valid_ops_roles')
const { Schema } = mongoose;


// ---------- Schemas
const UsrSchema = new Schema({
    _id:{type: Schema.Types.ObjectId, ref: "User"},
    role:{type:String,default:"OWNER",required:[true],enum:validOpsRoles},
}) 

const OperationSchema = new Schema ({
    mission: String,
    order: Number,
    enemy: String,
    ourForces: String,
    aggregationsAndSegregations: String,
    coordination:String,
    apolog:String,
    command:String,
    communications:String,
    name: { type: String, required :true},
    updated: { type: Date, default: Date.now },
    situation: String,
    phases: [{ 
        name: { type: String, required :true},
        timelines:[{
            entities: [{
                type: Schema.Types.ObjectId,
                ref: "Entity"
            }]
        }],
        layout: [{
            entity:{
                type: Schema.Types.ObjectId,
                ref: "Entity"
            },
            location:[]
        }]
    }],
    comboEntities: [{
        type: Schema.Types.ObjectId,
        ref: "Entity"
    }],
    users:[UsrSchema]

});


module.exports = mongoose.model('Operation',OperationSchema);
