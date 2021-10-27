'use strict';
const {exec} = require('child_process');

const getWaveform = async (vodTarget, imgTarget) => {
  return new Promise((resolve, reject) => {
    // local debug code
    const command = `ffmpeg -i ${vodTarget} -filter_complex "aformat=channel_layouts=mono,showwavespic=s=1540x62:colors=A072FD" -frames:v 1 ${imgTarget}`;
    if (vodTarget) {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log('----- ffmpeg error -----');
          console.log(error);
          reject(new Error(error));
        } else {
          const metaObj = stdout;

          console.log(metaObj);

          resolve(resObj);
        }
      });
    }
  });
};

const getMetadata = async (url) => {
  return new Promise((resolve, reject) => {
    const command = `/opt/bin/ffprobe -i "${url}" -v quiet -print_format json -show_format -show_streams -hide_banner`;
    // local debug code
    // const command = `ffprobe -i "${url}" -v quiet -print_format json -show_format -show_streams -hide_banner`;
    if (url) {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log('----- ffprobe error -----');
          console.log(error);
          reject(new Error(error));
        } else {
          const metaObj = JSON.parse(stdout);
          const streams = metaObj.streams;
          let width = 0;
          let height = 0;
          let totalFrames = 0;
          let avgFrameRate = 0;
          // for (const stream in streams) {
          for (let index = 0; index < streams.length; index++) {
            const stream = streams[index];
            if (stream.codec_type == 'video') {
              width = stream.width;
              height = stream.height;
              totalFrames = stream.nb_frames;
              const framerates = stream.avg_frame_rate.split('/');
              avgFrameRate = framerates[0] / framerates[1];
            }
          }
          const resObj = {
            date: new Date(),
            type: width >= 1280 ? 'HD' : 'SD',
            width: width,
            height: height,
            duration: metaObj.format.duration,
            totalFrames: totalFrames,
            avgFrameRate: avgFrameRate.toFixed(2),
            displayAspectRatio: metaObj.streams[0].display_aspect_ratio,
            detail: metaObj,
          };
          resolve(resObj);
        }
      });
    }
  });
};


module.exports = {getMetadata, getWaveform};
