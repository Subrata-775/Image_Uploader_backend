const cloudinary = require("cloudinary").v2;
const File = require("../models/File");


// **********************************************
//            LOCAL FILE UPLOAD
// **********************************************

exports.localFileUpload = async (req, res) => {
    try {

        const uploadedFile = req.files.file;

        const path =
            __dirname +
            "/files/" +
            Date.now() +
            `.${uploadedFile.name.split(".").pop()}`;

        uploadedFile.mv(path, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "File upload failed",
                });
            }
        });

        res.status(200).json({
            success: true,
            message: "Local file uploaded successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
};



// **********************************************
//            FILE TYPE CHECK
// **********************************************

function isFileTypeSupported(supportedTypes, fileType) {
    return supportedTypes.includes(fileType);
}



// **********************************************
//        CLOUDINARY FILE UPLOAD FUNCTION
// **********************************************

async function uploadToCloudinary(file, folder, quality) {

    const options = { folder };

    options.resource_type = "auto";

    if (quality) {
        options.quality = quality;
    }

    console.log("Temp file path:", file.tempFilePath);

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}



// **********************************************
//              IMAGE FILE UPLOAD
// **********************************************

exports.imageFileUpload = async (req, res) => {
    try {

        const { name, email, tags } = req.body;

        const imageFile = req.files.imageFile;

        const supportedTypes = ["jpg", "jpeg", "png"];

        const fileType = imageFile.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(supportedTypes, fileType)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        const response = await uploadToCloudinary(imageFile, "DevSubrata");

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image uploaded successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};



// **********************************************
//              VIDEO FILE UPLOAD
// **********************************************

exports.videoFileUpload = async (req, res) => {
    try {

        const { name, email, tags } = req.body;

        if (!req.files || !req.files.videoFile) {
            return res.status(400).json({
                success: false,
                message: "No video uploaded",
            });
        }

        const videoFile = req.files.videoFile;

        const supportedTypes = ["mp4", "mov"];

        const fileType = videoFile.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(supportedTypes, fileType)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        if (videoFile.size > 500 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "File too large",
            });
        }

        const response = await uploadToCloudinary(videoFile, "DevSubrata");

        const fileData = await File.create({
            name,
            tags,
            email,
            videoUrl: response.secure_url,
        });
        conbsole.log(fileData)

        res.status(200).json({
            success: true,
            videoUrl: response.secure_url,
            message: "Video uploaded successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};



// **********************************************
//        IMAGE REDUCED QUALITY UPLOAD
// **********************************************

exports.imageReduceUpload = async (req, res) => {
    try {

        const { name, email, tags } = req.body;

        const imageFile = req.files.imageFile;

        const supportedTypes = ["jpg", "jpeg", "png"];

        const fileType = imageFile.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(supportedTypes, fileType)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        const response = await uploadToCloudinary(imageFile, "DevSubrata", 5);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Compressed image uploaded successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};