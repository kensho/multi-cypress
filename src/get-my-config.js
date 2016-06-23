'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const inCurrent = require('path').join.bind(null, process.cwd())

function getMyConfig (name) {
  la(is.unemptyString(name), 'missing name to look for')
  const packagePath = inCurrent('package.json')
  const pkg = require(packagePath)
  if (!is.object(pkg.config)) {
    return
  }
  if (!is.object(pkg.config[name])) {
    return
  }
  return pkg.config[name]
}

module.exports = getMyConfig
