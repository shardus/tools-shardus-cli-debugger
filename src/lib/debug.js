const fs = require('fs')
const got = require('got')
const tar = require('tar')

async function debug (instanceUrl, instanceDir, progressFn) {
  // Ensure that the instanceDir exists
  await ensureExists(instanceDir)

  // Stream and extract tar.gz debug files from each node into instances dir
  await streamExtractFile(`http://${instanceUrl}/debug`, instanceDir, progressFn)
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

function streamExtractFile (url, savePath, progressFn) {
  return new Promise((resolve, reject) => {
    const download = got.stream(url, { decompress: false })
    download.on('error', reject)
    download.on('downloadProgress', progressFn)

    const out = tar.extract({ cwd: savePath })
    out.on('error', reject)
    out.on('close', resolve)

    download.pipe(out)
  })
}

module.exports = debug
