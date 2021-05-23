const mongoose = require('mongoose');
const Entity = require('./entity');
const { Schema } = mongoose;


// ---------- Schemas
const EntityTimelineSchema = new Schema ({
    // entity: { type: Schema.Types.ObjectId, ref: 'Entity', required: true }, //reference to the associated entity
    // timeline: { type: Schema.Types.ObjectId, ref: 'Timeline', required: true }, //reference to the associated timeline
    // order: Number,
    // entity: Entity
});

module.exports = mongoose.model('EntityTimeline',EntityTimelineSchema);
