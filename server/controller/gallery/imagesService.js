const AWS = require('aws-sdk');
const BUCKET_NAME = process.env.IMAGES_BUCKET;
const s3 = new AWS.S3({});

async function upload(imageName, base64Image, type) {
    const params = {
        Bucket: `${BUCKET_NAME}/images`,
        Key: imageName,
        Body: new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: type
    };

    let data;

    try {
        data = await promiseUpload(params);
    } catch (err) {
        console.error("err===>", err);

        return "";
    }

    return data.Location;
}

function promiseUpload(params) {
    return new Promise(function (resolve, reject) {
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {upload};