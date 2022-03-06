const fs = require('fs');

const traits = require('./traits.js');
const { backgrounds, faces, eyes, mouths } = traits;

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

module.exports = {
  getAttributes,
  saveMetaDataUri
}