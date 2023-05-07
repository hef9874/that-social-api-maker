const mongoose = require('mongoose');
const { connect, connection } = require("mongoose");

const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialApi_db";

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('debug', true);

module.exports = connection;