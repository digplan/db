import { Schema } from './module.mjs'
import { strict as assert } from 'node:assert' 

const s = new Schema()
assert.equal(s.schema.Base.id, 'string')

const testok = s.validate({'name': 'cb'}, 'TestType')
assert.equal(testok.ok, true)

/*const testokcustom = s.validate({ 'name': 'cb' }, 'TestType')
assert.equal(testokcustom.ok, true)

const testbad = s.validate({ 'names': 'cb' }, 'TestType')
assert.equal(testbad.ok, false)
assert.equal(testbad.error, '')

const testbadcustom = s.validate({ 'names': 'cb' }, 'TestType')
assert.equal(testbadcustom.ok, false)
assert.equal(testbad.error, '')
*/