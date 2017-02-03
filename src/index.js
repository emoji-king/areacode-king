const areacodemap = require('../lib/areacode-map')

function parse(number) {
  if (number.startsWith('+1')) {
    number = number.slice(2)
  } else if (number.startsWith('1')) {
    number = number.slice(1)
  }

  return areacodemap.long[number.slice(0,6)] || areacodemap.short[number.slice(0,3)]
}

module.exports = { parse }
