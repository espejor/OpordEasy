const mongoose = require('mongoose');
const { Schema } = mongoose;

// ---------- Schemas
const EntitySchema = new Schema ({
    entityType: Number,
    dateCreation: { type: Date, default: Date.now },
    favorite: Boolean,
    location: [],
    entityOptions: {}
    // values_: {}
});

module.exports = mongoose.model('Entity',EntitySchema);
