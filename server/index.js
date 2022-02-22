require("./config/config")

const express = require ('express');
const morgan = require ('morgan');
const app = express();
const cors = require ('cors')
const { mongoose } = require('./database');
const path = require('path');

const operationsRoutes = require('./routes/operations.routes');
const entitiesRoutes = require('./routes/entities.routes');
const usersRoutes = require('./routes/users.routes');

// --------- Settings
// Setting PORTs
app.set('port', process.env.PORT);


// --------- Middlewares
// Con morgan podemos tener información de las llamadas al servidor
app.use(morgan('dev'))
// Para entender el código que viene en formato JSON desde el navegador
app.use(express.json());
// Para que el servidor de base de datos se comunique con el servidor de la página

// app.use (cors({origin: 'http://localhost:4200'}));
app.use (cors());

// --------- Routes
app.use('/api/operations',operationsRoutes)
app.use('/api/entities',entitiesRoutes)
app.use('/api/users',usersRoutes)

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '../dist/opord-easy'));

// app.get('*', function(req,res) {
//     res.sendFile(path.join(__dirname ,'../dist', 'index.html'));
// });

const allowed = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.svg',
    '.ico'
  ];
  
  // Catch all other routes and return the angular index file
  app.get('*', (req, res) => {
     if (allowed.filter(ext => req.url.indexOf(ext) > 0).length > 0) {  
        console.log(" Fetching from.." + path.join(__dirname, `../dist/${req.url}`));
        res.sendFile(path.join(__dirname, `../dist/opord-easy/${req.url}`));
     } 
     else {
        console.log(" Fetching from.." + path.join(__dirname,'../dist', 'index.html'));
        res.sendFile(path.join(__dirname, '../dist/opord-easy', 'index.html'));
     }
  });


// Iniciamos el servidos REST API
app.listen(app.get('port'), () => {
    console.log('Server on Port ', app.get('port'));
})