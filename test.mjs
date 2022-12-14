import { eSchema as Validator } from './module.mjs'
import SchemaDefinition from './public/schemas/test-schema.mjs'
import assert from 'node:assert/strict'

const bad_constructor = () => new Validator()
assert.throws(bad_constructor, /Error: provide a schema definition/)

const s = new Validator(SchemaDefinition)
assert.equal(s.schema.Base.id, 'string')

const testok = s.validate({'id': 'cb', 'name': 'cb'}, 'TestType')
assert.equal(testok.name, 'cb')

const fail = () => s.validate({ 'id': 'myid', 'name': 'cb', 'created': 'x' }, 'TestType')
assert.throws(fail, /Error: value: "x" not valid for field type "newdate"/)

const fail_no_fields = () => s.validate({}, 'TestType')
assert.throws(fail_no_fields, /Error: field name does not exist in object/)

const fail_no_fields2 = () => s.validate({id: 'onefield'}, 'TestType')
assert.throws(fail_no_fields2, /Error: field name does not exist in object/)

const fail_extra_field = () => s.validate({ some: 'field' }, 'TestType')
assert.throws(fail_extra_field, /Error: provided field some = "field" not in type "TestType"/)

const allow_optional = s.validate({ id: 'field', name: 'name', optional: 'this optional' }, 'TestType')
assert.equal(allow_optional.optional, 'this optional')

const invalid_custom_type = () => s.validate({ id: 'field', name: 'name', created: 'xxxx' }, 'TestType')
assert.throws(invalid_custom_type, /Error: value: "xxxx" not valid for field type "newdate"/)

const invalid_custom_create = () => s.validate({}, 'TestType2')
assert.throws(invalid_custom_create, /Error: created value xx for field type datetype could not be validated/)

const dont_overwrite_values = s.validate({ id: 'field', name: 'name', created: '2010-01-01' }, 'TestType')
assert.equal(dont_overwrite_values.created, '2010-01-01')

const use_object_for_custom_field = s.validate({date: '2021-01-01', age: 50}, 'TestType2')
assert.equal(use_object_for_custom_field.old, false)

const invalid = SchemaDefinition._fieldtype_datetype.enforce('xxxx')
assert.equal(invalid, false)

const valid = SchemaDefinition._fieldtype_datetype.enforce('2021-01-01')
assert.equal(valid, true)

const { create } = SchemaDefinition._fieldtype_isOld
const transform = create(40)
assert.equal(transform, true)

const nested_parents = () => s.validate({ id: '1', created: new Date(), name: 'me', ee: 2 }, 'ExtendExtend')
assert.throws(nested_parents, /Error: value: "2" not valid for field type "string"/)

const nested_parents2 = s.validate({ id: '1', created: new Date(), name: 'me', ee: 'two' }, 'ExtendExtend')
assert.equal(nested_parents2.ee, 'two')

const schema_def_extended = s.getSchemaFor('ExtendExtend')
assert.equal(schema_def_extended._extends, 'TestType')
assert.equal(schema_def_extended.ee, 'string')
assert.equal(schema_def_extended.name, 'string')
assert.equal(schema_def_extended.id, 'string')
assert.equal(schema_def_extended.created, 'newdate')

const jschema = {
    "MyType": {
        "name": "string",
        "type": "string"
    }
}
const explicit = new Validator(jschema)
const badvals = () => explicit.validate({}, 'DoesntExist')
assert.throws(badvals, /Error: provided type DoesntExist does not exist in the schema/)
assert.equal(explicit.validate({name: 'myname', type: 'mytypeval'}, 'MyType').name, 'myname')
// fail on key provided - blank value
const blankTypeField = () => explicit.validate({name: 'myname', type: ''}, 'MyType')
assert.throws(blankTypeField, /Error: blank value provided for fieldtype string fieldname type/)

// Server
import serve from 'instaserve'
import routes from './routes.mjs'
const server = serve(routes)

// Fetch DB
import { FetchDB } from './module.mjs'
import schema from './public/schemas/test-schema.mjs'
import { save } from 'instax'

const DB = new FetchDB(schema)
DB.remoteHost = 'http://localhost:3000'

const insert = await DB.insert('Base:Test1', {id: 'somevalue'}, 'Base')
assert.equal(insert.ok, 'insert')
const del = await DB.delete('Base:Test1')
assert.equal(del.ok, 'delete')
const insert2 = await DB.insert('Base:Test2', { id: 'somevalue' }, 'Base')
assert.equal(insert2.ok, 'insert')
const update = await DB.update('Base:Test2', { id: 'somevalue2' }, 'Base')
assert.equal(update.ok, 'update')
await DB.delete('Base:Test2')

try {
    await DB.update('Base:notthere', { id: 'somevalue2' }, 'Base')
} catch(e) {
    assert.match(e.message, /invalid call update for Base:notthere/)
}

const [one, two, three] = process.argv
if(!three)
  server.stop()

console.log('closing server')

