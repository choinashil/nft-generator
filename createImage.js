const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const { FILE_PATH } = require('./constants.js');
const { generateNfts } = require('./generateCombination.js');
const { uploadMetaData } = require('./meta.js');

const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

const saveImage = (canvas, serialNum) => {
  const fileName = `N${serialNum.toString().padStart(3, 0)}`;
  fs.writeFileSync(
    `${FILE_PATH}/_Final/${fileName}.png`, 
    canvas.toBuffer('image/png')
  );
};

const createNftFiles = async (nft, i) => {
  const background = await loadImage(`${FILE_PATH}/backgrounds/${nft[0]}.png`);
  const face = await loadImage(`${FILE_PATH}/faces/${nft[1]}.png`);
  const eye = await loadImage(`${FILE_PATH}/eyes/${nft[2]}.png`);
  const mouth = await loadImage(`${FILE_PATH}/mouths/${nft[3]}.png`);

  await ctx.drawImage(background, 0, 0, 512, 512);
  await ctx.drawImage(face, 0, 0, 512, 512);
  await ctx.drawImage(eye, 0, 0, 512, 512);
  await ctx.drawImage(mouth, 0, 0, 512, 512);

  saveImage(canvas, i + 1);
  await uploadMetaData(nft, i + 1); // metaData upload to IPFS
}

(async () => {
  const NFTs = generateNfts();

  console.log('Creating...');
  for (let i = 0; i < NFTs.length; i++) {
    await createNftFiles(NFTs[i], i);
  }
  console.log('Completed');
})();
