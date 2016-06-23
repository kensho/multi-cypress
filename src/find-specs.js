'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')
const glob = require('glob')

function findFiles (pattern) {
  if (Array.isArray(pattern)) {
    debug('returning filenames', pattern)
    return pattern
  }
  la(is.unemptyString(pattern), 'expected pattern string', pattern)

  debug('collecting source files using pattern', pattern)
  const specs = glob.sync(pattern)
  debug('found %d spec files', specs.length)
  return specs
}

module.exports = findFiles
