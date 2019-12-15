const path = require('path');

module.exports = {
  '~': path.join(__dirname, './pages'),
  components: path.join(__dirname, './components'),
  constants: path.join(__dirname, './constants'),
  models: path.join(__dirname, './models'),
  utils: path.join(__dirname, './utils')
};
