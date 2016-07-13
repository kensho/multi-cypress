#!/usr/bin/env node

'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')
const rollem = require('rollem')
const R = require('ramda')

const defaultConfig = {
  specs: 'src/*-spec.js',
  destination: 'cypress/integration',
  gitlab: true,
  docker: 'bahmutov/cypress-image'
}
const config = require('./get-my-config')('multi-cypress', defaultConfig)
if (!config) {
  console.error('Cannot find package.json > config > multi-cypress object')
  process.exit(1)
}
debug('multi-cypress config', config)

const findSpecs = require('./find-specs')
const inputFiles = findSpecs(config.specs)
debug('input spec files')
debug(inputFiles)

function cleanOutputFolder (folder) {
  la(is.unemptyString(folder), 'missing folder name', folder)
  const fs = require('fs-extra-promise').usePromise(require('bluebird'))
  debug(`deleting output folder ${folder}`)
  fs.removeSync(folder)
}
cleanOutputFolder(config.destination)

const makeConfigs = require('./make-configs')
const configs = makeConfigs(config.destination, inputFiles)
debug(`made ${configs.length} configs from specs`)

function isWatchArgument (arg) {
  return arg === '-w' || arg === '--watch'
}
const options = {
  watch: process.argv.some(isWatchArgument)
}

const generateGitLabCiFile = require('./generate-gitlab-file')
const generateGitLab = generateGitLabCiFile.bind(null,
  config.destination,
  R.map(R.prop('dest'), configs),
  config.docker || config.image,
  config.script,
  config.before_script,
  config.after_script
)
const writeGitLabFile = config.gitlab ? generateGitLab : R.I

function buildError (err) {
  console.error('Could not build everything')
  if (err.message) {
    console.error(err.message)
  }
  if (err.stack) {
    console.error(err.stack)
  }
}

function exit () {
  process.exit(1)
}

if (options.watch) {
  rollem(configs, options)
    .then((roller) => {
      roller.on('rolled', writeGitLabFile)
    })
} else {
  rollem(configs, options)
    .then(writeGitLabFile)
    .catch(R.pipe(buildError, exit))
}
