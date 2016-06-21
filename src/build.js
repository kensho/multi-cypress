'use strict'

const path = require('path')
const relative = path.join.bind(null, __dirname)
const configs = require(relative('./rollem.config.js'))
const rollem = require('rollem')
const R = require('ramda')

function isWatchArgument (arg) {
  return arg === '-w' || arg === '--watch'
}
const options = {
  watch: process.argv.some(isWatchArgument)
}

const generateGitLabCiFile = require('./generate-gitlab-file')

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
      roller.on('rolled', generateGitLabCiFile)
    })
} else {
  rollem(configs, options)
    .then(generateGitLabCiFile)
    .catch(R.pipe(buildError, exit))
}
