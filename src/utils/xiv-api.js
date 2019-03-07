const XIVAPI = require('xivapi-js');
const xiv = new XIVAPI('85fb06d1e4e94cf0bee73acf');

export default {
  search(){
    var results = xiv.search('Stuffed Khloe')
    console.log(results)
    return results
  }
}
