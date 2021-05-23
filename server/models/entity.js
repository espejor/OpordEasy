const mongoose = require('mongoose');
const { Schema } = mongoose;


// ---------- Schemas
const EntitySchema = new Schema ({
    // entityType: String,
    // coordinates: [[Number,Number]]
});

module.exports = mongoose.model('Entity',EntitySchema);
