const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        console.log("DB connection is successful");
    }
    catch (error) {
        console.log("DB connection issue");
        console.error(error);
        process.exit(1);
    }
};