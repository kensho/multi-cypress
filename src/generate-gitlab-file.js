'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')

const path = require('path')
const relative = path.join.bind(null, __dirname)
const inCurrent = path.join.bind(null, process.cwd())
const fs = require('fs')

// expect common output folder
function generateGitLabCiFile (outputFolder, specFiles) {
  la(is.arrayOfStrings(specFiles), 'expected list of specs', specFiles)
  const names = specFiles.map((full) => path.basename(full, '.js'))
  debug('project names', names)

  const templateName = relative('./gitlab-ci-template.yml')
  const start = fs.readFileSync(templateName, 'utf8')
  var gitlabFile = '# this is a generated file\n' + start

  gitlabFile += `
  # Hidden job that defines an anchor named 'e2e_test_definition'
  # This job will be automatically assigned "test" phase
  .job_template: &e2e_test_definition
    script:
      - cypress ci --spec "${outputFolder}/$CI_BUILD_NAME.js"
`

  names.forEach((name) => {
    gitlabFile += `
${name}:
  <<: *e2e_test_definition
    `
  })
  gitlabFile += '\n'
  const gitlabFilename = inCurrent('.gitlab-ci.yml')
  fs.writeFileSync(gitlabFilename, gitlabFile, 'utf8')
  console.log('saved', gitlabFilename)
}

module.exports = generateGitLabCiFile
