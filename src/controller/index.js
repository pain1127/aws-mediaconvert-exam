const express = require('express');
const router = new express.Router();
const aws = require('aws-sdk');
aws.config.httpOptions = {timeout: 1000};
const s3 = require('../middleware/s3');
const fs = require('fs');
const ffmpeg = require('../middleware/ffmpeg');


aws.config.mediaconvert = {endpoint : 'https://qqvfzmfac.mediaconvert.ap-northeast-2.amazonaws.com'};

router.get('/image', async (req, res, next) => {
  const mediaconvert = new aws.MediaConvert();
  var params = {
    Id: '1633503243983-8o3rdg' /* required */
  };
  const result = await mediaconvert.getJob(params).promise();

  res.status(200).send(result);

});

router.get('/waveform', async (req, res, next) => {
  const vodTarget = '/tmp/a.mp4';
  const imgTarget = '/tmp/waveform.png';
  // s3 파일 다운
  const params  = {
    bucket : 'vcast-dev-hybe-s3-storage',
    key : 'upload/media/20211025/20211025105647/20211025105645929.mp4',
  }

  s3.s3Downlaod(params, vodTarget).then((success) => {

    ffmpeg.getWaveform(vodTarget, imgTarget);

    const fileBuffer = fs.readFileSync(imgTarget);

    const imgObj = {
      Bucket: 'vcast-dev-hybe-s3-storage',
      Key : 'upload/media/20211025/20211025105647/waveform.png',
      ContentType: 'image/png',
      Body: fileBuffer,
    }

    s3.s3Upload(imgObj).then((success) => {
      res.status(200).send(success);
    });

  });

  // const result = 'ok';
  // res.status(200).send(result);

});



// 트랜스코딩 요청

router.get('/endpoint', async (req, res, next) => {

  // const result = await axios.get('https://qqvfzmfac.mediaconvert.ap-northeast-2.amazonaws.com');

  // res.send('test');

  // const mediaconvert = new aws.MediaConvert();

  // const params = {
  //   Mode: 'DEFAULT',
  //   // NextToken: 'STRING_VALUE'
  // };

  // mediaconvert.describeEndpoints(params, function(err, data) {
  //   if (err) res.send(err, err.stack); // an error occurred
  //   else     res.send(data);           // successful response
  // });

});

router.get('/JobRequest', async (req, res, next) => {
  try {
    const mediaconvert = new aws.MediaConvert();

    const testSettings = [{
      "Name": "File Group",
      "OutputGroupSettings": {
        "Type": "FILE_GROUP_SETTINGS",
        "FileGroupSettings": {
          "Destination": "s3://vcast-dev-convbiz-s3-storage/media/20211018/M20211015132038327/transcoding/"
        }
      },
      "Outputs": [{
        "VideoDescription": {
          "CodecSettings": {
            "Codec": "H_264",
            "H264Settings": {
              "RateControlMode": "QVBR",
              "SceneChangeDetect": "DISABLED",
              "QualityTuningLevel": "SINGLE_PASS",
              "MaxBitrate": 1000000,
              "QvbrSettings": {
                "QvbrQualityLevel": 7
              },
              "FramerateControl": "SPECIFIED",
              "FramerateNumerator": 30,
              "FramerateDenominator": 1,
              "InterlaceMode": "PROGRESSIVE",
              "FramerateConversionAlgorithm": "DUPLICATE_DROP",
              "ParNumerator": 1,
              "ParDenominator": 1,
              "GopSize": 30,
              "GopSizeUnits": "FRAMES",
              "NumberBFramesBetweenReferenceFrames": 0,
              "GopClosedCadence": 1,
              "NumberReferenceFrames": 1,
              "DynamicSubGop": "STATIC",
              "RepeatPps": "DISABLED",
              "GopBReference": "DISABLED",
              "MinIInterval": 0,
              "CodecProfile": "MAIN",
              "CodecLevel": "LEVEL_3_1",
              "UnregisteredSeiTimecode": "DISABLED",
              "EntropyEncoding": "CABAC",
              "Slices": 1,
              "Softness": 0,
              "AdaptiveQuantization": "HIGH",
              "SpatialAdaptiveQuantization": "ENABLED",
              "TemporalAdaptiveQuantization": "ENABLED",
              "FlickerAdaptiveQuantization": "DISABLED"
            }
          },
          "Width": 1280,
          "Height": 720,
          "ColorMetadata": "IGNORE"
        },
        "AudioDescriptions": [{
          "CodecSettings": {
            "Codec": "AAC",
            "AacSettings": {
              "Bitrate": 96000,
              "CodingMode": "CODING_MODE_2_0",
              "SampleRate": 48000
            }
          }
        }],
        "ContainerSettings": {
          "Container": "MP4",
          "Mp4Settings": {}
        },
        "NameModifier": "M20211015132038327_transcoding_convbiz-1000k-horizontal"
      }]
    }, {
      "Name": "File Group",
      "OutputGroupSettings": {
        "Type": "FILE_GROUP_SETTINGS",
        "FileGroupSettings": {
          "Destination": "s3://vcast-dev-convbiz-s3-storage/media/20211018/M20211015132038327/transcoding/"
        }
      },
      "Outputs": [{
        "VideoDescription": {
          "CodecSettings": {
            "Codec": "H_264",
            "H264Settings": {
              "RateControlMode": "QVBR",
              "SceneChangeDetect": "DISABLED",
              "QualityTuningLevel": "SINGLE_PASS",
              "MaxBitrate": 2000000,
              "QvbrSettings": {
                "QvbrQualityLevel": 7
              },
              "FramerateControl": "SPECIFIED",
              "FramerateNumerator": 30,
              "FramerateDenominator": 1,
              "InterlaceMode": "PROGRESSIVE",
              "FramerateConversionAlgorithm": "DUPLICATE_DROP",
              "ParNumerator": 1,
              "ParDenominator": 1,
              "GopSize": 30,
              "GopSizeUnits": "FRAMES",
              "NumberBFramesBetweenReferenceFrames": 0,
              "GopClosedCadence": 1,
              "NumberReferenceFrames": 1,
              "DynamicSubGop": "STATIC",
              "RepeatPps": "DISABLED",
              "GopBReference": "DISABLED",
              "MinIInterval": 0,
              "CodecProfile": "MAIN",
              "CodecLevel": "LEVEL_3_1",
              "UnregisteredSeiTimecode": "DISABLED",
              "EntropyEncoding": "CABAC",
              "Slices": 1,
              "Softness": 0,
              "AdaptiveQuantization": "HIGH",
              "SpatialAdaptiveQuantization": "ENABLED",
              "TemporalAdaptiveQuantization": "ENABLED",
              "FlickerAdaptiveQuantization": "DISABLED"
            }
          },
          "Width": 1280,
          "Height": 720,
          "ColorMetadata": "IGNORE"
        },
        "AudioDescriptions": [{
          "CodecSettings": {
            "Codec": "AAC",
            "AacSettings": {
              "Bitrate": 96000,
              "CodingMode": "CODING_MODE_2_0",
              "SampleRate": 48000
            }
          }
        }],
        "ContainerSettings": {
          "Container": "MP4",
          "Mp4Settings": {}
        },
        "NameModifier": "M20211015132038327_transcoding_convbiz-2000k-horizontal"
      }]
    }];


    // 정상 작동 Output Setting

    const outputSettings = [
      {
        "Name": "File Group",
        "OutputGroupSettings": {
          "Type": "FILE_GROUP_SETTINGS",
          "FileGroupSettings": {
            "Destination": "s3://vcast-dev-convbiz-s3-storage/media/"
          }
        },
        "Outputs": [
          {
            "VideoDescription": {
              "CodecSettings": {
                "Codec": "H_264",
                "H264Settings": {
                  "RateControlMode": "QVBR",
                  "SceneChangeDetect": "DISABLED",
                  "QualityTuningLevel": "SINGLE_PASS",
                  "MaxBitrate": 1500000,
                  "QvbrSettings": {
                    "QvbrQualityLevel": 7
                  },
                  "FramerateControl": "SPECIFIED",
                  "FramerateNumerator": 30,
                  "FramerateDenominator": 1,
                  "InterlaceMode": "PROGRESSIVE",
                  "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                  "ParNumerator": 1,
                  "ParDenominator": 1,
                  "GopSize": 30,
                  "GopSizeUnits": "FRAMES",
                  "NumberBFramesBetweenReferenceFrames": 0,
                  "GopClosedCadence": 1,
                  "NumberReferenceFrames": 1,
                  "DynamicSubGop": "STATIC",
                  "RepeatPps": "DISABLED",
                  "GopBReference": "DISABLED",
                  "MinIInterval": 0,
                  "CodecProfile": "MAIN",
                  "CodecLevel": "LEVEL_3_1",
                  "UnregisteredSeiTimecode": "DISABLED",
                  "EntropyEncoding": "CABAC",
                  "Slices": 1,
                  "Softness": 0,
                  "AdaptiveQuantization": "HIGH",
                  "SpatialAdaptiveQuantization": "ENABLED",
                  "TemporalAdaptiveQuantization": "ENABLED",
                  "FlickerAdaptiveQuantization": "DISABLED"
                }
              },
              "Width": 1280,
              "Height": 720,
              "ColorMetadata": "IGNORE"
            },
            "AudioDescriptions": [
              {
                "CodecSettings": {
                  "Codec": "AAC",
                  "AacSettings": {
                    "Bitrate": 96000,
                    "CodingMode": "CODING_MODE_2_0",
                    "SampleRate": 48000
                  }
                }
              }
            ],
            "ContainerSettings": {
              "Container": "MP4",
              "Mp4Settings": {}
            },
            "NameModifier": "convbiz-1000k"
          }
        ],
        "CustomName": "convbiz"
      }
    ];

    
      
    

    const job = {
      "Queue": "arn:aws:mediaconvert:ap-northeast-2:972521143148:queues/Default",
      "UserMetadata": {},
      "Role": "arn:aws:iam::972521143148:role/service-role/VCAST-DEV-CATENOID-ROLE-MEDIACONVERT",
      "Settings": {
        "Inputs": [
          {
            "TimecodeSource": "ZEROBASED",
            "VideoSelector": {},
            "AudioSelectors": {
              "Audio Selector 1": {
                "DefaultSelection": "DEFAULT"
              }
            },
            "FileInput": "s3://vcast-dev-convbiz-s3-storage/upload/media/20211013/20211013173758/20211013173757441.mp4"
          }
        ],
        "OutputGroups": testSettings,
        "TimecodeConfig": {
          "Source": "ZEROBASED"
        }
      },
      "AccelerationSettings": {
        "Mode": "DISABLED"
      },
      "StatusUpdateInterval": "SECONDS_10",
      "Priority": 0
    }

    // console.log(JSON.stringify(job));
    // res.status(200).send(JSON.stringify(job));

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
