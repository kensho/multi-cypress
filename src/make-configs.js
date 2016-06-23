'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const path = require('path')

function makeConfigs (destinationFolder, specs) {
  la(is.unemptyString(destinationFolder), 'missing destination', destinationFolder)
  la(is.array(specs), 'missing spec filenames', specs)

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

module.exports = makeConfigs
