'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')
const inCurrent = require('path').join.bind(null, process.cwd())

function getMyConfig (name, defaultConfig) {
  la(is.unemptyString(name), 'missing name to look for')
  la(is.object(defaultConfig), 'missing default config')

  const packagePath = inCurrent('package.json')
  debug('reading', packagePath)
  const pkg = require(packagePath)
  if (!is.object(pkg.config)) {
    debug(`cannot find config object in ${packagePath}`)
    return defaultConfig
  }
  if (!is.object(pkg.config[name])) {
    debug(`cannot find config ${name} object in ${packagePath}`)
    return defaultConfig
  }
  return pkg.config[name]
}

module.exports = getMyConfig
