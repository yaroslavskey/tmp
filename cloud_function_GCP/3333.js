const path = require('path');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const fs = require('fs');

async function cloud(event) {
  const serviceKey = path.join(__dirname, './keys.json');
  const storageConf = { keyFilename: serviceKey };
  const storage = new Storage(storageConf);

  const downlaodOptions = {
    destination: `/tmp/` + event.name,
  };

  try {
    let res = await storage
      .bucket(event.bucket)
      .file(event.name)
      .download(downlaodOptions);
  } catch (err) {
    console.log(err);
  }

  return res;
}

async function convertToWebPandResaze(bucket, name, resize) {
  const filepath = `/tmp`;
  //const filepath = `gs://${bucket}`;
  //const compresedName = path.join(filepath, '222222.webp');
  try {
    if (resize) {
      await sharp(path.join(filepath, name))
        .resize({
          width: 320,
          height: 320,
        })
        .toBuffer();
    } else {
      await sharp(path.join(filepath, name)).webp().toBuffer();
    }
  } catch (error) {
    console.log(error);
  }

  const testFolder = '/tmp/';
  fs.readdir(testFolder, (err, files) => {
    files.forEach((file) => {
      console.log(`download `, file);
    });
  });
  
  return Buffer;
}

exports.helloGCS = (event) => {
  cloud(event);

  const testFolder = '/tmp/';
  fs.readdir(testFolder, (err, files) => {
    files.forEach((file) => {
      console.log(`download 1`, file);
    });
  });

  convertToWebPandResaze(event.bucket, event.name, true);

};
