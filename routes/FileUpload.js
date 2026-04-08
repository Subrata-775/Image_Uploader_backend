const express = require("express");

const router =express.Router();

const { localFileUpload, imageFileUpload, videoFileUpload, imageReduceUpload } = require("../controllers/fileUpload");

router.post("/localFileUpload", localFileUpload);
router.post("/imageFileUpload", imageFileUpload);
router.post("/videoFileUpload", videoFileUpload);
router.post("/imageReduceUpload", imageReduceUpload);



module.exports=router;