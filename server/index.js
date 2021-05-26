const express = require ('express');
const morgan = require ('morgan');
const app = express();
const cors = require ('cors')
const { mongoose } = require('./database');
const path = require('path');

const routes = require('./routes/operations.routes');

// --------- Settings
// Setting PORTs
app.set('port', process.env.PORT || 3000);


// --------- Middlewares
// Con morgan podemos tener información de las llamadas al servidor
app.use(morgan('dev'))
// Para entender el código que viene en formato JSON desde el navegador
app.use(express.json());
// Para que el servidor de base de datos se comunique con el servidor de la página

// app.use (cors({origin: 'http://localhost:4200'}));
// app.use (cors({origin: 'https://opordeasy.herokuapp.com/',credentials:true}));

// --------- Routes
app.use('/api/operations',routes)
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '../dist'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname ,'../dist', 'index.html'));
});

// Iniciamos el servidos REST API
app.listen(app.get('port'), () => {
    console.log('Server on Port ', app.get('port'));
})