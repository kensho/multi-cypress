'use strict'

const debug = require('debug')('build')
const la = require('lazy-ass')
const is = require('check-more-types')
const path = require('path')
const relative = path.join.bind(null, __dirname)
const glob = require('glob')
const Promise = require('bluebird')
const fs = require('fs-extra-promise').usePromise(Promise)

function generateGitLabCiFile () {
  const sourceFolder = path.join(process.cwd(), 'cypress/integration')
  const specFiles = glob.sync(`${sourceFolder}/*-spec.js`)
  la(is.array(specFiles), 'missing spec files in', sourceFolder)
  const names = specFiles.map((full) => path.basename(full, '.js'))
  debug('project names', names)

  const templateName = relative('./gitlab-ci-template.yml')
  const start = fs.readFileSync(templateName, 'utf8')
  var gitlabFile = '# this is a generated file\n' + start
  names.forEach((name) => {
    gitlabFile += `
${name}:
  <<: *e2e_test_definition
    `
  })
  gitlabFile += '\n'
  const gitlabFilename = relative('../.gitlab-ci.yml')
  fs.writeFileSync(gitlabFilename, gitlabFile, 'utf8')
  console.log('saved', gitlabFilename)
}

module.exports = generateGitLabCiFile
