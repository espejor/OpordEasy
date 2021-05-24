
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://espejor:d5mv3RRK-_f9UzT@opordeasy.zptty.mongodb.net/opordeasy?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
