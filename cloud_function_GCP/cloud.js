const path = require('path');
const { Storage } = require('@google-cloud/storage');

async function test() {
  const serviceKey = path.join(__dirname, './keys.json');

  const storageConf = { keyFilename: serviceKey };

  const storage = new Storage(storageConf);

  const downlaodOptions = {
    destination: __dirname + '/test.jpg',
  };

  try {
    let res = await storage
      .bucket('upload-first')
      .file('test.jpg')
      .download(downlaodOptions);
  } catch (err) {
    console.log(err);
  }

  await sharp(res)
    .webp()
    .resize({
      width: 320,
      height: 320,
    })
    .toFile(gcsEvent.name);

  const storage2 = new Storage();
  const options = {
    destination: gcsEvent.name.split('.')[0] + '.webp',
    preconditionOpts: { ifGenerationMatch: 0 },
  };

  await storage2.bucket('upload-two').upload(filePath, options);
  console.log(`${filePath} uploaded to ${'upload-two'}`);
}


const path = require('path');
const {Storage} = require('@google-cloud/storage');

exports.helloGCS = (event, context) => {
  const serviceKey = path.join(__dirname, './keys.json')


const storageConf = {keyFilename:serviceKey}

const storage = new Storage(storageConf)

const downlaodOptions = {
      destination: __dirname+`/`+ event.name
    };

    try {
    let res =await storage
      .bucket(event.bucket)
      .file(event.name)
      .download(downlaodOptions); 
   }
   catch(err){
    console.log(err)
   }



  const gcsEvent = event.name;
  console.log(`Processing file: ${JSON.stringify(gcsEvent)}`);
};
