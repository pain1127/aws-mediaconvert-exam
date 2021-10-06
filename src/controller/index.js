const express = require('express');
const router = new express.Router();
const aws = require('aws-sdk');
aws.config.region = 'ap-northeast-2'
aws.config.apiVersions = {
  mediaconvert: '2017-08-29',
};

aws.config.mediaconvert = {endpoint : 'https://qqvfzmfac.mediaconvert.ap-northeast-2.amazonaws.com'};

// 트랜스코딩 요청

router.get('/JobRequest', async (req, res, next) => {
  try {
    const mediaconvert = new aws.MediaConvert();
    const job = {
      "Queue": "arn:aws:mediaconvert:ap-northeast-2:972521143148:queues/Default",
      "UserMetadata": {},
      "Role": "arn:aws:iam::972521143148:role/service-role/MediaConvert_Default_Role",
      "Settings": {
        "TimecodeConfig": {
          "Source": "ZEROBASED"
        },
        "OutputGroups": [
          {
            "Name": "File Group",
            "Outputs": [
              {
                "Preset": "vcastPreview-Preset",
                "NameModifier": "_vcastPreview_1000k"
              }
            ],
            "OutputGroupSettings": {
              "Type": "FILE_GROUP_SETTINGS",
              "FileGroupSettings": {
                "Destination": "s3://vcast-dev-catenoid-s3-storage/dummy/mediaConvert/output/"
              }
            }
          }
        ],
        "Inputs": [
          {
            "AudioSelectors": {
              "Audio Selector 1": {
                "DefaultSelection": "DEFAULT"
              }
            },
            "VideoSelector": {},
            "TimecodeSource": "ZEROBASED",
            "FileInput": "s3://vcast-dev-catenoid-s3-storage/dummy/ronaldo.mp4"
          }
        ]
      },
      "AccelerationSettings": {
        "Mode": "DISABLED"
      },
      "StatusUpdateInterval": "SECONDS_10",
      "Priority": 0
    }

    const result = await mediaconvert.createJob(job).promise();

    res.status(200).send(result);

  } catch (err) {
    res.send(err.message);
  }
});

// Job 상태 확인

router.get('/JobStatus', async (req, res, next) => {
  const mediaconvert = new aws.MediaConvert();
  var params = {
    Id: '1633503243983-8o3rdg' /* required */
  };
  const result = await mediaconvert.getJob(params).promise();

  res.status(200).send(result);

});

module.exports = router;
