require("dotenv").config();
const fs = require('fs');
const { NFTStorage, File } = require('nft.storage');

const { FILE_PATH } = require('./constants.js');
const traits = require('./traits.js');
const { backgrounds, faces, eyes, mouths } = traits;

const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

const getAttributes = (trait, traitIndex) => {
  let traitType = '';
  let value = '';

  switch(trait) {
    case 0:
      traitType = 'Background';
      value = backgrounds[traitIndex].name;
      break;

    case 1:
      traitType = 'Face';
      value = faces[traitIndex].name;
      break;

    case 2:
      traitType = 'Eyes';
      value = eyes[traitIndex].name;
      break;

    case 3:
      traitType = 'Mouth';
      value = mouths[traitIndex].name;
      break;

    default:
      traitType = '';
      value = '';
  }

  return { trait_type: traitType, value };
};

const saveMetaDataUri = (uri) => {
  const fileName = 'meta.txt';
  fs.writeFileSync(`./${fileName}`, uri + '\r\n', { flag: 'a+' });
}

const readMetaDataUri = async (i) => {
  const buffer = await fs.readFileSync(META_FILE);
  let tokenUri = '';

  const regexp = new RegExp('(\r?\n)?' + index + '=(.*)/metadata.json', 'g');
  const result = buffer.toString().match(regexp);

  if (result !== null) {
    tokenUri = result[0].slice(result[0].indexOf('=') + 1);
    console.log(tokenUri);
  }

  return tokenUri;
}

const uploadMetaData = async (nft, serialNum) => {
  console.log('Uploading...', nft);

  const metaData = {
    description: '',
    name: `ALS-${serialNum}`,
    type: 'Collectable',
    image: 'https://',
    attributes: [],
  }

  const traitsLength = Object.keys(traits).length;

  for (let trait = 0; trait < traitsLength; trait++) {
    metaData.attributes.push(getAttributes(trait, nft[trait] - 1)); 
  }

  const fileName = `N${serialNum.toString().padStart(3, 0)}`;

  metaData.image = new File(
    [await fs.promises.readFile(`${FILE_PATH}/_Final/${fileName}.png`)],
    `${fileName}.png`,
    { type: 'image/png' }
  );

  const result = await nftStorage.store(metaData);
  console.log('result.url: ', result.url);
  saveMetaDataUri(`${serialNum}=${result.url}`);
}

exports.uploadMetaData = uploadMetaData;
