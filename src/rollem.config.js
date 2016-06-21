'use strict'

const debug = require('debug')('rollem')
const path = require('path')
const relative = path.join.bind(null, __dirname)
const glob = require('glob')
const fs = require('fs-extra-promise').usePromise(require('bluebird'))

const sourceFolder = relative('./src')
const destinationFolder = relative('./cypress/integration')

fs.removeSync(destinationFolder)

function collectFiles () {
  debug('source folder', sourceFolder)
  const specs = glob.sync(`${sourceFolder}/**/*-spec.js`)
  debug('found %d spec files', specs.length)
  return specs
}

function makeConfigs (specs) {
  const configs = specs.map((spec) => {
    const name = path.basename(spec)
    return {
      entry: `${spec}`,
      dest: `${destinationFolder}/${name}`,
      format: 'es6'
    }
  })
  return configs
}

const configs = makeConfigs(collectFiles())
module.exports = configs
