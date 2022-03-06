require("dotenv").config();
const fs = require('fs');
const { NFTStorage, File } = require('nft.storage');

const { FILE_PATH } = require('./constants.js');
const traits = require('./traits.js');
const { getAttributes, saveMetaDataUri } = require('./utils.js');

const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

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
    name: `WIGGLE-${serialNum}`,
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
