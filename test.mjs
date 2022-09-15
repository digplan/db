import { Schema } from './module.mjs'
import { strict as assert } from 'node:assert' 

const s = new Schema()
assert.equal(s.schema.Base.id, 'string')

const testok = s.validate({'id': 'cb', 'name': 'cb'}, 'TestType')
assert.equal(testok.ok.id, 'cb')

const fail = s.validate({ 'id': 'myid', 'name': 'cb', 'created': 'x' }, 'TestType')
assert.equal(fail.ok, false)
assert.equal(fail.error, 'value: x not valid for custom type "TestType"')

const fail_no_fields = s.validate({}, 'TestType')
assert.equal(fail_no_fields.ok, false)
assert.equal(fail_no_fields.error, 'required field id does not exist')

const fail_no_fields2 = s.validate({id: 'onefield'}, 'TestType')
assert.equal(fail_no_fields2.ok, false)
assert.equal(fail_no_fields2.error, 'required field name does not exist')

const fail_extra_field = s.validate({ some: 'field' }, 'TestType')
assert.equal(fail_extra_field.ok, false)
assert.equal(fail_extra_field.error, 'required field some not in type "TestType"')

const allow_optional = s.validate({ id: 'field', name: 'name', optional: 'this optional' }, 'TestType')
assert.equal(allow_optional.ok.optional, 'this optional')

const valid_custom_type = s.validate({ id: 'field', name: 'name', created: '2012-01-01' }, 'TestType')
assert.equal(valid_custom_type.ok.id, 'field')

const invalid_custom_type = s.validate({ id: 'field', name: 'name', created: 'xxxx' }, 'TestType')
assert.equal(invalid_custom_type.error, 'value: xxxx not valid for custom field type "created"')


console.log('test complete')