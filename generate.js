import Promise from 'bluebird'
import fs from 'mz/fs'
import agent from 'superagent'
import geocode from './geocode'

// Install unhandled rejection handler.
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

async function generate(url) {
  if (!url) url = 'https://raw.githubusercontent.com/googlei18n/libphonenumber/master/resources/geocoding/en/1.txt'
  const list = (await agent.get(url)).text

  const short = {}
  const long = {}

  await Promise.map(list.split('\n'), async (l) => {
    const m = l.match(/^1([0-9]+)[^0-9](.*)/)
    if (m) {
      const code = m[1]
      const region = m[2]
      const location = await geocode(region)
      delete location.result

      if (code.length <= 4) {
        short[code] = {r: region, l: location}
      } else {
        long[code] = {r: region, l: location}
      }
    }
  }, {concurrency: 20})

  console.log('module.exports = {')

  console.log('short:')
  console.log(JSON.stringify(short))
  console.log(',')

  console.log('long:')
  console.log(JSON.stringify(long))

  console.log('}')
}

generate()
