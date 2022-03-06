const { backgrounds, faces, eyes, mouths } = require('./traits.js');

const TARGET_NUM_OF_NFT = 5;
const NFTs = [];

const getRandomElement = (limit) => {
  return Math.floor(Math.random() * limit);
}

const generateNft = () => {
  const nftToBe = [];

  nftToBe.push(backgrounds[getRandomElement(backgrounds.length)].id);
  nftToBe.push(faces[getRandomElement(faces.length)].id);
  nftToBe.push(eyes[getRandomElement(eyes.length)].id);
  nftToBe.push(mouths[getRandomElement(mouths.length)].id);

  const hasAlreadyExisted = NFTs.filter(nft => JSON.stringify(nft) === JSON.stringify(nftToBe)).length;
  return hasAlreadyExisted ? null : nftToBe;
}

const generateNfts = () => {
  while (NFTs.length < TARGET_NUM_OF_NFT) {
    const nft = generateNft();
  
    if (nft !== null) {
      NFTs.push(nft);
    }
  }

  return NFTs;
}

exports.generateNfts = generateNfts;
