'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const relative = require('path').join.bind(null, __dirname)

/* global describe, it */
describe('find-specs', () => {
  const findSpecs = require('./find-specs')

  it('finds javascript files', () => {
    const found = findSpecs(relative('./*.js'))
    la(is.array(found), 'returns array', found)
    la(is.not.empty(found), 'finds files', found)
  })

  it('finds just spec files', () => {
    const found = findSpecs(relative('./*-spec.js'))
    la(is.array(found), 'returns array', found)
    la(is.not.empty(found), 'finds files', found)
  })

  it('can return given list', () => {
    const list = ['foo.js', 'bar.js']
    const found = findSpecs(list)
    la(list === found, 'just returns the given list', found)
  })
})
