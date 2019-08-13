const lib = require('./lib')

async function debug (args, options, logger) {
  try {
    await lib.debug(args['instanceUrl'], args['instanceDir'] || process.cwd())
  } catch (e) {
    logger.error(e)
  }
}

async function collect (args, options, logger) {
  try {
    await lib.collect(args['instanceUrl'], args['networkDir'] || process.cwd())
  } catch (e) {
    logger.error(e)
  }
}

function combine (args, options, logger) {
  try {
    lib.combine(args['networkDir'])
  } catch (e) {
    logger.error(e)
  }
}

exports.debug = debug
exports.collect = collect
exports.combine = combine
