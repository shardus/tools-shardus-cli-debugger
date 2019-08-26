const path = require('path')
const got = require('got')
const { ensureExists, streamExtractFile } = require('./utils')

async function collect (instanceUrl, networkDir, progressFn) {
  // Ensure that the networkDir exists
  await ensureExists(networkDir)

  // Get nodelist
  const nodelistUrl = new URL('/nodelist', `http://${instanceUrl}`)
  const { body: { nodelist } } = await got.get(nodelistUrl.toString(), { json: true })

  // Stream and extract tar.gz debug file into each instances dir
  for (const [index, node] of nodelist.entries()) {
    const debugUrl = new URL('/debug', `http://${node.externalIp}:${node.externalPort}`)
    const savePath = path.join(networkDir, `debug-${debugUrl.hostname}-${debugUrl.port}`)
    await ensureExists(savePath)
    await streamExtractFile(debugUrl.toString(), savePath, progress => progressFn({ currentNode: index + 1, totalNodes: nodelist.length, ...progress }))
  }
}

module.exports = collect
