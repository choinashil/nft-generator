const fs = require('fs');
const { toGatewayURL } = require('nft.storage');

const META_FILE = './meta.href.txt';

const convertGatewayUrl = async (index) => {
  const buffer = await fs.readFileSync(META_FILE);
  let tokenUri = '';

  const regexp = new RegExp('(\r?\n)?' + index + '=(.*)/metadata.json', 'g');
  const result = buffer.toString().match(regexp);

  if (result !== null) {
    tokenUri = result[0].slice(result[0].indexOf('=') + 1);
  }

  return `${index}=${toGatewayURL(tokenUri).href}`;
}

for (let k = 0; k < 500; k++) {
  convertGatewayUrl(k).then((uri) => {
    fs.writeFileSync(META_FILE, uri + '\r\n', { flag: 'a+' });
  });
}
