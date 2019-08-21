const fs = require('fs')
const axios = require('axios')
const tar = require('tar')

async function debug (instanceUrl, instanceDir) {
  // Ensure that the instanceDir exists
  await ensureExists(instanceDir)

  // Stream and extract tar.gz debug files from each node into instances dir
  await streamExtractFile(`http://${instanceUrl}/debug`, instanceDir)
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

module.exports = debug
