const express = require("express");
const app = express();
// port 
require('dotenv').config();
const PORT = process.env.PORT || 4000 ;
// middleware
app.use(express.json());

// USE multer or express-fileupload package 
const fileupload = require('express-fileupload');
app.use(fileupload());

// Cloud connect 

const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// databse connect
require('./config/database').connect();
// routes
const upload = require('./routes/FileUpload')
app.use('/api/v1/upload', upload);

app.listen(PORT, () => {
    console.log(`app is listening on the port no : ${PORT}`)
});
app.get('/', (req, res) => {
    res.send(`<h1>This is a Home Page</h1>`)
})

