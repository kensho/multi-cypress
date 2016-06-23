'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')
const inCurrent = require('path').join.bind(null, process.cwd())

function getMyConfig (name) {
  la(is.unemptyString(name), 'missing name to look for')
  const packagePath = inCurrent('package.json')
  debug('reading', packagePath)
  const pkg = require(packagePath)
  if (!is.object(pkg.config)) {
    debug(`cannot find config object in ${packagePath}`)
    return
  }
  if (!is.object(pkg.config[name])) {
    debug(`cannot find config ${name} object in ${packagePath}`)
    return
  }
  return pkg.config[name]
}

module.exports = getMyConfig
