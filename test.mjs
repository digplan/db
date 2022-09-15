import { Schema } from './module.mjs'
import assert from 'node:assert/strict'

const s = new Schema()
assert.equal(s.schema.Base.id, 'string')

const testok = s.validate({'id': 'cb', 'name': 'cb'}, 'TestType')
assert.equal(testok.name, 'cb')

const fail = () => s.validate({ 'id': 'myid', 'name': 'cb', 'created': 'x' }, 'TestType')
assert.throws(fail, /Error: value: x not valid for custom field type "newdate"/)

const fail_no_fields = () => s.validate({}, 'TestType')
assert.throws(fail_no_fields, /Error: field id does not exist in object/)

const fail_no_fields2 = () => s.validate({id: 'onefield'}, 'TestType')
assert.throws(fail_no_fields2, /Error: field name does not exist in object/)

const fail_extra_field = () => s.validate({ some: 'field' }, 'TestType')
assert.throws(fail_extra_field, /Error: required field some not in type "TestType"/)

const allow_optional = s.validate({ id: 'field', name: 'name', optional: 'this optional' }, 'TestType')
assert.equal(allow_optional.optional, 'this optional')

const invalid_custom_type = () => s.validate({ id: 'field', name: 'name', created: 'xxxx' }, 'TestType')
assert.throws(invalid_custom_type, /Error: value: xxxx not valid for custom field type "newdate"/)

const invalid_custom_create = () => s.validate({}, 'TestType2')
assert.throws(invalid_custom_create, /Error: created value xx for field type datetype could not be validated/)

const dont_overwrite_values = s.validate({ id: 'field', name: 'name', created: '2010-01-01' }, 'TestType')
assert.equal(dont_overwrite_values.created, '2010-01-01')

const use_object_for_custom_field = s.validate({date: '2021-01-01', age: 50}, 'TestType2')
assert.equal(use_object_for_custom_field.old, false)

console.log('test complete')