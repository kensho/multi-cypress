'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('get-my-config', () => {
  const getConfig = require('./get-my-config')

  it('returns default options if no config found', () => {
    const def = {foo: 'bar'}
    const pkg = {}
    const found = getConfig('foo', def, pkg)
    la(is.object(found), 'expected an object back', found)
    la(found === def, 'found')
  })

  it('returns default options if no config found with name', () => {
    const def = {foo: 'bar'}
    const pkg = {
      config: {}
    }
    const found = getConfig('foo', def, pkg)
    la(is.object(found), 'expected an object back', found)
    la(found === def, 'found')
  })

  it('merges options with defaults', () => {
    const def = {bar: 'bar'}
    const pkg = {
      config: {
        name: {
          foo: 42
        }
      }
    }
    const found = getConfig('name', def, pkg)
    la(is.object(found), 'expected an object back', found)
    la(found !== def, 'returns new object', found)
    la(found.foo === 42, 'returns new option', found)
    la(found.bar === 'bar', 'returns default option', found)
  })

  it('new option wins over default', () => {
    const def = {foo: 'bar'}
    const pkg = {
      config: {
        name: {
          foo: 42
        }
      }
    }
    const found = getConfig('name', def, pkg)
    la(is.object(found), 'expected an object back', found)
    la(found !== def, 'returns new object', found)
    la(found.foo === 42, 'returns new option', found)
  })
})
