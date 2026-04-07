
const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = async (req, res) => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("DB connection is successfull.")
        }).catch((e) => {
            console.log("DB connection issued..")
            console.error(e);
            process.exit(1);
        });

};