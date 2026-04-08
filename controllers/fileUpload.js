
const cloudinary = require("cloudinary").v2;
const File = require('../models/File')

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





// *******************************************************************************
//                              Image file Upload
// ********************************************************************************

// type is supported  or not
async function isFileTypeSupported(supportFile, UploadImageType) {
    return supportFile.includes(UploadImageType);
}


// Upload in cloudinary 
async function UploadCloudinaryFile(ImageUploadedFile, Folder) {
    const options = { folder: Folder };
    options.resource_type = "auto";
    console.log("Temp file path", ImageUploadedFile.tempFilePath);
    return await cloudinary.uploader.upload(ImageUploadedFile.tempFilePath, options);

}
exports.imageFileUpload = async (req, res) => {
    try {

        // access Data from body 
        const { name, email, tags } = req.body;
        console.log(name, email, tags);
        // access image file 
        const ImageUploadedFile = req.files.imageFile;
        console.log(ImageUploadedFile)

        // validation check
        const supportFile = ['jpg', 'jpeg', 'png'];
        const UploadImageType = ImageUploadedFile.name.split('.')[1].toLowerCase();
        console.log("file type", UploadImageType);
        const isSupported = isFileTypeSupported(supportFile, UploadImageType);

        // condition
        if (!isSupported) {
            return res.status(400).json({
                success: false,
                message: "File Format is not supported."
            })
        }

        // if support  then upload in cloudinary 
        console.log("Upoading in devSubrata")
        const response = await UploadCloudinaryFile(ImageUploadedFile, "DevSubrata");
        console.log(response)
        console.log(response.secure_url)

        // DB entry


        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });

        console.log(fileData)


        res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image  is successfully uploaded"
        })

    } catch (e) {
        console.error(e);
        res.status(400).json({
            success: false,
            message: "something went wrong"
        })
    }
};





// *******************************************************************************
//                             video file Upload
// ********************************************************************************
// type is supported  or not
async function isVideoFileTypeSupported(supportedType, videoFileType) {
    return supportedType.includes(videoFileType);
}

async function uploadCloudinaryVideoFile(videoFile, folder) {
    const options = { folder: folder };
    options.resource_type = "auto";
    console.log("Temp file path:", videoFile.tempFilePath);

    return await cloudinary.uploader.upload(videoFile.tempFilePath, options);
}

exports.videoFileUpload = async (req, res) => {
    try {

        const { name, email, tags } = req.body;

        if (!req.files || !req.files.videoFile) {
            return res.status(400).json({
                success: false,
                message: "No video uploaded"
            })
        }

        const videoFile = req.files.videoFile;

        const supportedType = ['mov', 'mp4'];

        const videoFileType = videoFile.name.split('.').pop().toLowerCase();

        const isSupported = isVideoFileTypeSupported(supportedType, videoFileType);

        if (!isSupported) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            })
        }

        if (videoFile.size > 500 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "File too large"
            })
        }

        const response = await uploadCloudinaryVideoFile(videoFile, "DevSubrata");

        const fileData = await File.create({
            name,
            tags,
            email,
            videoUrl: response.secure_url
        });
        console.log(fileData)

        res.status(200).json({
            success: true,
            videoUrl: response.secure_url,
            message: "Video uploaded successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}