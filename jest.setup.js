const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

module.exports = async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();

  // Set the MongoDB URI to the in-memory server's URI
  process.env.MONGODB_URI = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};