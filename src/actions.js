const path = require('path')
const lib = require('./lib')

async function debug (args, options, logger) {
  const url = args['instanceUrl']
  const dir = args['instanceDir'] || process.cwd()
  try {
    await lib.debug(url, dir, ({ transferred }) => {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      const dirpath = path.normalize(path.relative(process.cwd(), dir))
      process.stdout.write(`Downloading from ${url} into ${dirpath} (${transferred} B)`)
    })
    process.stdout.write('\n')
  } catch (e) {
    logger.error('Error: ' + e.message)
  }
}

async function collect (args, options, logger) {
  try {
    await lib.collect(args['instanceUrl'], args['networkDir'] || process.cwd())
  } catch (e) {
    logger.error('Error: ' + e.message)
  }
}

function combine (args, options, logger) {
  try {
    lib.combine(args['networkDir'])
  } catch (e) {
    logger.error('Error: ' + e.message)
  }
}

exports.debug = debug
exports.collect = collect
exports.combine = combine
