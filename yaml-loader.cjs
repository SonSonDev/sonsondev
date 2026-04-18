const yaml = require('js-yaml')

module.exports = function (source) {
  return 'module.exports = ' + JSON.stringify(yaml.load(source))
}
