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
}

async function convertToWebPandResaze(name, resize) {
  const filepath = `/tmp`;
  const compresedName = path.join(
    filepath,
    name.split('.')[0] + resize + '.webp',
  );
  try {
    if (resize) {
      await sharp(path.join(filepath, name))
        .webp()
        .resize({
          width: 320,
          height: 320,
        })
        .toFile(compresedName);
    } else {
      await sharp(path.join(filepath, name)).webp().toFile(compresedName);
    }
  } catch (error) {
    console.log(error);
  }

  const testFolder = '/tmp/';
  fs.readdir(testFolder, (err, files) => {
    files.forEach((file) => {
      console.log(`down`, file);
    });
  });

  return compresedName;
}

// async function uploadFileGCP(filePath, name, resize) {
//   const storage = new Storage();
//   const options = {
//     destination: name.split('.')[0] + resize + '.webp',
//     preconditionOpts: { ifGenerationMatch: 0 },
//   };

//   await storage.bucket('upload-first').upload(filePath, options);
//   console.log(`${filePath} uploaded to ${'upload-first'}`);
//   return name.split('.')[0] + resize + '.webp';
// }

async function convert(name) {
  const resized = await convertToWebPandResaze(name, true);
  // const GCPresized = await uploadFileGCP(resized, name, true).catch(
  //   console.error,
  // );
  const original = await convertToWebPandResaze(name, false);
  // const GCPoriginal = await uploadFileGCP(original, name, false).catch(
  //   console.error,
  // );
}

exports.helloGCS = (event) => {
  cloud(event);
  convert(event.name);
  // const gcsEvent = event.name;
  // console.log(`Processing file: ${JSON.stringify(gcsEvent)}`);
};
