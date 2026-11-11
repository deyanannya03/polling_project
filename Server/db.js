const moongoose = require('mongoose');
const connectDb = require('./db.js');
const connectDB = async () => {
    try {
        const conn = await moongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;

