import request from 'superagent-bluebird-promise'

const DEFAULT_OPTIONS = {
  useCachedQueries: true,
  proxyUrl: 'http://localhost:9001/api/v1/Geocode',
}

class Geocode {
  constructor(options = {}) {
    this.opts = { ...DEFAULT_OPTIONS, ...options }
    this.cachedQueries = {}
  }

  async geocode(query, options = {}) {
    const opts = { ...this.opts, ...options }
    const q = query && query.toLowerCase().trim()
    if (!q) return undefined

    const params = {q}
    if (opts.countriesToLimit !== undefined) {
      params.contriesToLimit = opts.countriesToLimit
    }
    if (opts.userLocation !== undefined) {
      params.userLocation = opts.userLocation
    }
    const key = JSON.stringify(params)

    if (this.opts.useCachedQueries && this.cachedQueries[key]) {
      return this.cachedQueries[key]
    }

    try {
      const latlon = (await request(opts.proxyUrl).query(params).retry(10)).body
      if (this.useCachedQueries) {
        this.cachedQueries[key] = latlon
      }
      return latlon
    } catch (err) {
      // Error, so ignore to fall through.
      console.log(`Geocode failed for: ${key}`)
      console.log(err)
    }

    return undefined
  }
}

const GEOCODE = new Geocode()

async function geocode(query, options) {
  return GEOCODE.geocode(query, options)
}

export { Geocode }
export default geocode
