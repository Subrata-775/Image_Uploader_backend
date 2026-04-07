const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    tags: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("file", FileSchema);