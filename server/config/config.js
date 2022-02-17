process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB = "";
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost/opordeasy";
} else {
    urlDB = "mongodb+srv://espejor:d5mv3RRK-_f9UzT@opordeasy.zptty.mongodb.net/opordeasy?retryWrites=true&w=majority"
};
process.env.URLDB = urlDB;

process.env.CADUCIDAD_TOKEN = '48h';

process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION ||  'este-es-el-seed-desarrollo';