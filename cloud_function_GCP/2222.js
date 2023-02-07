const path = require('path');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

async function cloud(event) {
  const serviceKey = path.join(__dirname, './keys.json');
  const storageConf = { keyFilename: serviceKey };
  const storage = new Storage(storageConf);

  const contents = await storage
    .bucket(`upload-two`)
    .file(event.name)
    .download();

  // console.log(
  //   `Contents of gs://${`upload-two`}/${
  //     event.name
  //   } are ${contents.toString()}.`,
  // );

  return contents;
}

async function convertToWebPandResaze(contents) {
  //console.log(`up`, contents)

  const bufff = Buffer.from(contents);
  console.log(`up`, bufff);
  const semiTransparentRedPng = await sharp(bufff, {
    raw: {
      width: 200,
      height: 100,
      channels: 3,
    },
  })
    .raw()
    .png()
    .toBuffer();

  // console.log(
  //   `Contents of gs://${`upload-two`}/are ${semiTransparentRedPng.toString()}.`);

  return semiTransparentRedPng;
}

async function uploadFileGCP(contents) {
  const storage = new Storage();
  //const options = name.split('.')[0] + resize + '.png';
  await storage.bucket('upload-first').file(`testtt.png`).save(contents);
}

async function convert(event) {
  const contents = await cloud(event);

  const resized = await convertToWebPandResaze(contents);
  const GCPresized = await uploadFileGCP(resized, true).catch(console.error);
  const original = await convertToWebPandResaze(contents);
  const GCPoriginal = await uploadFileGCP(original, false).catch(console.error);
}

exports.helloGCS = (event) => {
  convert(event);
  // const gcsEvent = event.name;
  // console.log(`Processing file: ${JSON.stringify(gcsEvent)}`);
};
