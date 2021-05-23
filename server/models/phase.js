const mongoose = require('mongoose');
const entity = require('./entity');
const Timeline = require('./timeline');
const { Schema } = mongoose;


// ---------- Schemas
const PhaseSchema = new Schema ({
    // name: { type: String, required :true},
    // order: number,
    // timelines:[{ type: Timeline }],
    // layout: [{ type: Entity }]
});

module.exports = mongoose.model('Phase',PhaseSchema);
