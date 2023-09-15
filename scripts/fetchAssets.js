const fs = require('fs');
const http = require('http');

async function fetchAssets(data) {
  const images = data.map(({ Icon }) => Icon);

  images.forEach((image) => {
    const imagePath = image.replace('/cj/1/', `${process.cwd()}/public/jobIcons`);
    const imgStream = fs.createWriteStream(imagePath);
    const options = {
      host: 'xivapi.com',
      protocol: 'http:',
      port: 80,
      path: image
    };

    http.get(options, (res) => {
      res.on('data', (chunk) => {
        imgStream.write(chunk);
      });
      res.on('end', () => {
        imgStream.end();
      });
    });
  });
}

(() => {
  fetch('https://xivapi.com/classJob?columns=Icon,Name')
    .then((data) => data.json())
    .then((json) => fetchAssets(json.Results));
})();
