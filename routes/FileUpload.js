const express = require("express");

const router =express.Router();

const { localFileUpload, imageFileUpload } = require("../controllers/fileUpload");

router.post("/localFileUpload", localFileUpload);
router.post("/imageFileUpload", imageFileUpload);


module.exports=router;