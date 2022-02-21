const mongoose = require('mongoose');
const { Schema } = mongoose;
// import Globals from '../../src/app/utilities/globals'

const ALREADY_REGITERED = "alreadyRegistered" 

// var uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ["ADMIN", "USER"],
    message: '{VALUE} no es un rol válido'
}

// ---------- Schemas
const UserSchema = new Schema ({
    firstName: {type: String, required: [true, 'El nombre es necesario']},
    lastName: {type: String, required: [true, 'Un apellido es necesario']},
    userName: {type: String, required: [true, 'El nombre de usuario es necesario']},
    email: {type: String, required: [true, 'El correo es necesario'],
        validate: {
            validator: async function(email) {
            const user = await this.constructor.findOne({ email });
            if(user) {
                if(this.id === user.id) {
                    return true;
                }
                return false;
            }
            return true;
            },
            type:ALREADY_REGITERED,
            message: props => 'El correo <' + props.value + '> ya existe en la BD'
        }
    }, 
    // unique:[true, 'Ese correo ya existe en la BD']},
    password: {type: String, required: [true, 'Una contraseña es necesaria']},
    role:{type:String,default:"USER",required:[true],enum:validRoles},
    avatar: {type: String}
}) 

// elimina la key password del objeto que retorna al momento de crear un usuario
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
 }

// UserSchema.plugin(uniqueValidator, {
//     message: '{PATH} debe de ser único'
// })

module.exports = mongoose.model('User',UserSchema);
