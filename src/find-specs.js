'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')
const glob = require('glob')

// const path = require('path')
// const relative = path.join.bind(null, __dirname)
// const fs = require('fs-extra-promise').usePromise(require('bluebird'))

// const sourceFolder = relative('./src')
// const destinationFolder = relative('./cypress/integration')

// fs.removeSync(destinationFolder)

function findFiles (pattern) {
  if (Array.isArray(pattern)) {
    debug('returning filenames', pattern)
    return pattern
  }
  la(is.unemptyString(pattern), 'expected pattern string', pattern)

  debug('collecting source files using pattern', pattern)
  // const specs = glob.sync(`${sourceFolder}/**/*-spec.js`)
  const specs = glob.sync(pattern)
  debug('found %d spec files', specs.length)
  return specs
}

module.exports = findFiles

// function makeConfigs (specs) {
//   const configs = specs.map((spec) => {
//     const name = path.basename(spec)
//     return {
//       entry: `${spec}`,
//       dest: `${destinationFolder}/${name}`,
//       format: 'es6'
//     }
//   })
//   return configs
// }

// const configs = makeConfigs(collectFiles())
// module.exports = configs
