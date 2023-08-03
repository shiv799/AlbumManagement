const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");

// Configure AWS SDK with your access key, secret access key, and region
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region, // Use the correct AWS region code, e.g., 'ap-south-1' for Mumbai
});

// Create a new instance of the S3 service
const s3 = new AWS.S3();

const uploadImage = async (req, res) => {
  const upload = multer({ dest: "uploads/" }).single("file");
  upload(req, res, (err) => {
    if (req.file == null) {
      return res
        .status(401)
        .json({ message: "Please choose the file", status: false });
    }

    var file = req.file;
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: fileStream,
    };

    s3.upload(params, function (err, data) {
      if (!data) {
        return res.status(401).json({ error: "Failed to upload file" });
      }
      return res.status(200).json({
        message: "File uploaded successfully",
        imageUrl: data.Location,
        status: true,
      });
    });
  });
};

module.exports = {
  uploadImage,
};
