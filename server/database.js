const mongoose = require('mongoose');

// const URI = 'mongodb://localhost/opordeasy'

const URI = 'mongodb+srv://espejor:d5mv3RRK-_f9UzT@opordeasy.zptty.mongodb.net/opordeasy?retryWrites=true&w=majority'

mongoose.connect(URI, { useNewUrlParser: true ,useUnifiedTopology: true })
    .then(db => console.log('DB connected'))
    .catch(err => console.error(err));

module.exports = mongoose;
