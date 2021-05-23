const mongoose = require('mongoose');
const EntityTimeline = require('./entity-timeline');
const { Schema } = mongoose;


// ---------- Schemas
const TimelineSchema = new Schema ({
    //phase: { type: Schema.Types.ObjectId, ref: 'Phase', required: true }, //reference to the associated phase
    // order: Number,
    // entities: [{ type: EntityTimeline }]
});

module.exports = mongoose.model('Timeline',TimelineSchema);
