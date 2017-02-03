import fs from 'mz/fs'
import agent from 'superagent'

async function generate(url) {
  if (!url) url = 'https://raw.githubusercontent.com/googlei18n/libphonenumber/master/resources/geocoding/en/1.txt'
  const list = (await agent.get(url)).text

  let short = {}
  let long = {}

  for (const l of list.split('\n')) {
    const m = l.match(/^1([0-9]+)[^0-9](.*)/)
    if (m) {
      let code = m[1]
      let region = m[2]

      if (code.length <= 4) {
        short[code] = region
      } else {
        long[code] = region
      }
    }
  }

  console.log('module.exports = {')

  console.log('short:')
  console.log(JSON.stringify(short))
  console.log(',')

  console.log('long:')
  console.log(JSON.stringify(long))

  console.log('}')
}

generate()
