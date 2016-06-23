'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')
const inCurrent = require('path').join.bind(null, process.cwd())
const merge = require('ramda').merge

function getMyConfig (name, defaultConfig, pkg) {
  la(is.unemptyString(name), 'missing name to look for')
  la(is.object(defaultConfig), 'missing default config')
  la(is.maybe.object(pkg), 'expected package object if passed', pkg)

  if (!pkg) {
    const packagePath = inCurrent('package.json')
    debug('reading', packagePath)
    pkg = require(packagePath)
  }

  if (!is.object(pkg.config)) {
    debug('cannot find config object in pkg')
    debug(pkg)
    return defaultConfig
  }
  if (!is.object(pkg.config[name])) {
    debug(`cannot find config ${name} object in pkg`)
    debug(pkg)
    return defaultConfig
  }

  const options = merge(defaultConfig, pkg.config[name])
  return options
}

module.exports = getMyConfig
