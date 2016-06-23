'use strict'

const debug = require('debug')('multi')
// const path = require('path')
// const relative = path.join.bind(null, __dirname)
// const inCurrent = path.join.bind(null, process.cwd())
// const configs = require('./find-specs')
// const rollem = require('rollem')
// const R = require('ramda')

const config = require('./get-my-config')('multi-cypress')
if (!config) {
  console.error('Cannot find package.json > config > multi-cypress object')
  process.exit(1)
}
debug('multi-cypress config', config)

const findSpecs = require('./find-specs')
const inputFiles = findSpecs(config.specs)
debug('input spec files')
debug(inputFiles)

// function isWatchArgument (arg) {
//   return arg === '-w' || arg === '--watch'
// }
// const options = {
//   watch: process.argv.some(isWatchArgument)
// }

// const generateGitLabCiFile = require('./generate-gitlab-file')

// function buildError (err) {
//   console.error('Could not build everything')
//   if (err.message) {
//     console.error(err.message)
//   }
//   if (err.stack) {
//     console.error(err.stack)
//   }
// }

// function exit () {
//   process.exit(1)
// }

// if (options.watch) {
//   rollem(configs, options)
//     .then((roller) => {
//       roller.on('rolled', generateGitLabCiFile)
//     })
// } else {
//   rollem(configs, options)
//     .then(generateGitLabCiFile)
//     .catch(R.pipe(buildError, exit))
// }
