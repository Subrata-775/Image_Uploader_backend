const file = require("../models/File");

// localFile Handler

exports.localFileUpload = async (req, res) => {
    try {

        // featch file 
        // Getting the uploaded file from request.
        // This works when using express-fileupload middleware.
        const uploadedFile = req.files.file;
        console.log(uploadedFile)
        // store this file into  a server location
        const path = __dirname + "/files/" + Date.now() + `.${uploadedFile.name.split(".")[1]}`;
        console.log(path)
        // move file
        uploadedFile.mv(path, (err) => {
            console.log(err);
        });

        res.status(200).json({
            success: true,
            message: "Local file uploaded successfull"
        })

    } catch (e) {
        res.status(400).json({
            success: false,
            message: "Local file uploaded feaild"
        })
    }
}

