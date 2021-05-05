/*

The functions in this file use the aws4 library to Sigv4 sign an HTTP request given a set of AWS credentials.

*/

const aws4  = require('aws4')
const parseUrl=function(url) {
    /* eslint-disable-next-line no-useless-escape */
    const match = url.match(/^(https?)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i)
    return {
      protocol: match[1] || '',
      host: match[2] || '',
      port: match[3] || '',
      path: match[4] || '',
      query: match[5] || '',
      fragment: match[6] || '',
    }
  }
const getBaseUrl=function(baseUrl, requestUrl) {
    if (baseUrl) {
      return baseUrl.replace(/\/$/, '') /* Remove trailing slash if found */
    }
    console.log('requestUrl', requestUrl)
    const { protocol, host } = parseUrl(requestUrl)
    if (!protocol || !host) {
      throw new Error('No baseURL set on api call. Set baseURL or provide full url in api call')
    }
    return `${protocol}://${host}`
  }

  const apply=function(src, tar) {
    tar.statusMessage = src.statusText
    tar.statusCode = src.status
    tar.data = src.body
  };

module.exports.signRequest=function(opts = {}) {
    // eslint-disable-next-line func-names
    return async function (pathOrUrl, requestData = {}) {
      let data = requestData
      let url = pathOrUrl
      if (typeof pathOrUrl === 'object') {
        data = url
        url = !data.path || data.path === '/' ? '' : data.path
      }
      const baseUrl = getBaseUrl(opts.baseURL, url)
      const urlInfo = parseUrl(baseUrl)
      const { host, path } = urlInfo
      const trailingPath = url.replace(baseUrl, '')
  
      /* Request payload */
      const payload = {
        method: (opts.method || 'GET').toUpperCase(),
        host: host,
        path: `${path}${trailingPath}`,
        url: `${baseUrl}${trailingPath}`,
        service: opts.service || 'execute-api',
        region: opts.region,
        ...data,
      }
      // console.log('payload', payload)
  
      /* fetch user creds */
      let credentials = opts.credentials || {}
      /* Use custom creds function */
      if (!Object.keys(credentials).length && opts.getCredentials) {
        try {
          credentials = await opts.getCredentials()
        } catch (err) {
          throw new Error(err)
        }
      }
      // console.log('credentials', credentials)
  
      const { accessKeyId, secretAccessKey, sessionToken } = credentials
      if (!accessKeyId || !secretAccessKey) {
        throw new Error('Not authenticated')
      }
  
      /* Sign the request with aws4 */
      const request = aws4.sign(payload, {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      })
      // console.log('request', request)
  
      let tmp = payload.body
  
      return new Promise((res, reject) => {
        fetch(payload.url, {
          method: opts.method,
          headers: request.headers,
          body: payload.body,
        })
          .then((response, reply) => {
            apply(response, response) // => response.headers
            reply = response.status >= 400 ? reject : res
  
            tmp = response.headers.get('content-type')
            // eslint-disable-next-line no-bitwise
            if (!tmp || !~tmp.indexOf('application/json')) {
              reply(response)
            } else {
              response.text().then((str) => {
                try {
                  response.data = JSON.parse(str)
                  reply(response)
                } catch (err) {
                  err.headers = response.headers
                  apply(response, err)
                  reject(err)
                }
              })
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }

