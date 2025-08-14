const mongoose = require('mongoose');

function connectDB() {
    if (!process.env.MONGODB_CONNECTION_STRING) {
        throw new Error("MONGODB_CONNECTION_STRING is not set in environment variables");
    }

    mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((error) => {
            console.error("MongoDB connection failed:", error.message);
        });
}

module.exports = connectDB;
