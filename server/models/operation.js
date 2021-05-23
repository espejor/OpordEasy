const mongoose = require('mongoose');
const Phase = require('./phase');
const User = require('./user');
const { Schema } = mongoose;


// ---------- Schemas
const OperationSchema = new Schema ({
    name: { type: String, required :true},
    updated: { type: Date, default: Date.now },
    phases: [{ 
        name: { type: String, required :true},
        timelines:[{
            entities: [{
                entity: { 
                    entityType: String
                 }
            }]
        }],
        layout: [{
            entityType: String,
            coordinates: [[Number,Number]]
        }]
    }],

    // user: { 
    //     firstName: {type: String, required: true},
    //     lastName: {type: String, required: true},
    //     userName: {type: String, required: true},
    //     email: {type: String, required: true},
    //     psw: {type: String, required: true},
    //     avatar: {type: String}
    // }, //reference to the associated user
});

module.exports = mongoose.model('Operation',OperationSchema);
