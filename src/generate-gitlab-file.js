'use strict'

const debug = require('debug')('multi')
const la = require('lazy-ass')
const is = require('check-more-types')

const path = require('path')
const relative = path.join.bind(null, __dirname)
const inCurrent = path.join.bind(null, process.cwd())
const fs = require('fs')

// expect common output folder
function generateGitLabCiFile (outputFolder, specFiles, dockerImage,
  script, afterScript) {
  debug(`generating gitlab file for folder "${outputFolder}"`)
  la(is.maybe.unemptyString(dockerImage),
    'docker image should be just string', dockerImage)
  if (dockerImage) {
    debug(`based on docker image ${dockerImage}`)
  }
  la(is.maybe.arrayOfStrings(script), 'expected test commands', script)

  const defaultTestCommands = [
    `cypress ci --spec "${outputFolder}/$CI_BUILD_NAME.js"`
  ]
  if (!script) {
    script = defaultTestCommands
  }
  debug('test commands')
  debug(script)

  const defaultAfterScriptCommands = []
  if (!afterScript) {
    afterScript = defaultAfterScriptCommands
  }
  if (is.not.empty(afterScript)) {
    debug('after script commands')
    debug(afterScript)
  }

  la(is.arrayOfStrings(specFiles), 'expected list of specs', specFiles)
  const names = specFiles.map((full) => path.basename(full, '.js'))
  debug('project names', names)

  const templateName = relative('./gitlab-ci-template.yml')
  const start = fs.readFileSync(templateName, 'utf8')
  var gitlabFile = '# this is a generated file\n'
  if (dockerImage) {
    gitlabFile += `image: ${dockerImage}
`
  }
  gitlabFile += start

  gitlabFile +=
    `
build-specs:
  stage: build
  script:
    - npm install
    - npm test
    - npm run build
  artifacts:
    paths:
      - ${outputFolder}

# Common build job definition using GitLab YAML features
# http://docs.gitlab.com/ce/ci/yaml/README.html#special-yaml-features

# we will generate the test definitions per spec bundle
# using the common definition
`

  gitlabFile +=
    `
# Hidden job that defines an anchor named 'e2e_test_definition'
# This job will be automatically assigned "test" phase
.job_template: &e2e_test_definition
  script:
`
  script.forEach((testCommand) => {
    gitlabFile += `    - ${testCommand}
`
  })
  if (is.not.empty(afterScript)) {
    gitlabFile += '  after_script:\n'
    afterScript.forEach((testCommand) => {
      gitlabFile += `    - ${testCommand}
`
    })
  }

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
