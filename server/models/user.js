const mongoose = require('mongoose');
const { Schema } = mongoose;


// ---------- Schemas
const UserSchema = new Schema ({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true},
    email: {type: String, required: true},
    psw: {type: String, required: true},
    avatar: {type: String}
});

module.exports = mongoose.model('User',UserSchema);
