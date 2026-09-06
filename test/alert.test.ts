import test from 'node:test'
import assert from 'node:assert/strict'
import { Alert, AlertActions } from '../src/alert.tsx'

test('Alert types and props definition', () => {
  assert.equal(typeof Alert, 'function')
  assert.equal(typeof AlertActions, 'function')
})
