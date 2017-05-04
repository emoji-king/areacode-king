const areacodemap = require('../lib/areacode-map')

function parseExtended(number) {
  if (number.startsWith('+1')) {
    number = number.slice(2)
  } else if (number.startsWith('1')) {
    number = number.slice(1)
  }

  const res = areacodemap.long[number.slice(0,6)] || areacodemap.short[number.slice(0,3)]
  if (res) {
    return {region: res.r, location: res.l }
  } else {
    return undefined
  }
}

function parse(number) {
  const res = parseExtended(number)
  if (res) { return res.r }
  return undefined
}

module.exports = { parse, parseExtended }
