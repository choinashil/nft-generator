require("dotenv").config();

const fs = require('fs');
const pinataSDK = require('@pinata/sdk');

const traits = require('./traits.js');
const { getAttributes, saveMetaDataUri } = require('./utils.js');

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET_KEY);
const IPFS_URL = 'https://gateway.pinata.cloud/ipfs';
const IPFS_IMAGE_HASH = process.env.PINATA_WIGGLE_CID;

const META_FILE = './meta.txt';

const uploadMetaData = async (nft, serialNum) => {
  console.log('Uploading...', nft);

  const metaData = {
    description: 'WIGGLE By NASHU',
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

  metaData.image = `${IPFS_URL}/${IPFS_IMAGE_HASH}/${fileName}.png`;

  const options = {
    pinataMetadata: { name: `wiggle-meta-${serialNum}` },
    pinataOptions: { cidVersion: 0 }
  }

  try {
    const result = await pinata.pinJSONToIPFS(metaData, options);
    saveMetaDataUri(`${serialNum}=${IPFS_URL}/${result.IpfsHash}`);
  } catch (err) {
    console.log(err);
  }
}

const readMetaDataPinataUri = async (i) => {
  const buffer = await fs.readFileSync(META_FILE);
  let tokenUri = '';

  let regexp = new RegExp('(\r?\n)?' + index + '=(.*)', 'g');
  const result = buffer.toString().match(regexp);

  if (result !== null) {
    tokenUri = result[0].slice(result[0].indexOf('=') + 1);
    console.log(tokenUri);
  }

  return tokenUri;
}

(async () => {
  const NFTs = JSON.parse(fs.readFileSync('./nfts.txt'));

  for (let i = 0; i < NFTs.length; i++) {
    await uploadMetaData(NFTs[i], i + 1);
  }
  console.log('Completed');
})();
