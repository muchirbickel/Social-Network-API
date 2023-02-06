const { connect, connection } = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetDB';

connect(connectionString, {
    useNewUrlParser: true,
    UseUnifiedTopology: true,
});

module.exports = connection;