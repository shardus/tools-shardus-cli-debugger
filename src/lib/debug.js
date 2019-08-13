const fs = require('fs')
const axios = require('axios')
const tar = require('tar')

async function debug (instanceUrl, instanceDir) {
  // Get nodelist from instanceUrl
  const { data: { nodelist } } = await axios('http://' + instanceUrl + '/nodelist')

  // Make an instances/ dir
  await ensureExists(instanceDir)

  // Stream and extract tar.gz debug files from each node into instances dir
  const debugFileUrls = nodelist.map(node => `http://${node.externalIp}:${node.externalPort}/debug`)
  await streamExtractFiles(debugFileUrls, instanceDir)
}

// From: https://stackoverflow.com/a/21196961
async function ensureExists (dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        // Ignore err if folder exists
        if (err.code === 'EEXIST') resolve()
        // Something else went wrong
        else reject(err)
      } else {
        // Successfully created folder
        resolve()
      }
    })
  })
}

async function streamExtractFiles (urls, savePath) {
  await Promise.all(urls.map(url => streamExtractFile(url, savePath)))
}

function streamExtractFile (url, savePath) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'stream'
    }).then(response => {
      const out = tar.extract({ cwd: savePath })
      response.data.pipe(out)
      out.on('close', resolve)
      out.on('error', reject)
    }).catch(reject)
  })
}

exports.debug = debug
