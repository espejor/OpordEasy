const mongoose = require('mongoose');

module.exports =  validOpsRoles = {
    values: ["OWNER", "VIEWER", "PARTNER"],
    message: '{VALUE} no es un rol válido'
}

// module.exports = enum('validOpsRoles',validOpsRoles)
