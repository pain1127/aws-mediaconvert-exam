'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3();
const fs = require('fs');
aws.config.httpOptions = {timeout: 1000};

const s3Downlaod = (obj, target) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: obj.bucket,
      Key: obj.key,
    };
    const fileStream = fs.createWriteStream(target);
    const s3Stream = s3.getObject(params).createReadStream();
    s3Stream.on('error', function(err) {
      reject(err);
      console.error(err);
    });

    s3Stream.pipe(fileStream).on('error', function(err) {
      reject(err);
    }).on('close', function() {
      resolve(target);
    });
  });
}

const s3Upload = (obj) => {
  return new Promise((resolve, reject) => {
    s3.putObject(obj, function(err, data) {
      if (err) {
        const result = {
          cmd: 's3putObject',
          result: false,
          message: err,
        };
        reject(result);
      } else {
        const result = {
          cmd: 's3putObject',
          message: '',
          result: true,
          response: data,
        };
        resolve(result);
      }
    });
  });
}


module.exports = {s3Downlaod, s3Upload};