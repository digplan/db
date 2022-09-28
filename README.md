````
Usage:
const s = new eSchema(schemajson)
s.validate({'id': 'cb', 'name': 'cb'}, 'TestType')

schemajson = {
    _fieldtype_newdate: {
        /* create a value
        enforce: (s) => (new Date(s).toString() !== 'Invalid Date'),
        create: () => new Date().toISOString()
    },
    Base: {
        id: 'string',
        created: 'newdate'
    },
    TestType: {

        /* extend other types */
        _extends: 'Base',

        name: 'string',

        /* optional field */
        'city?': 'string'
    }
}

Server db:
import serve from 'instaserve'
import routes from './routes.mjs'
const server = serve(routes)

Client js:
import { FetchDB } from 'https://unpkg.com/e-schema'
import schema from 'https://unpkg.com/e-schema/test-schema.mjs'

const DB = new FetchDB(schema)
DB.remoteHost = 'http://localhost:3000' // or '' for local server

const insert = await DB.insert('Base:Test1', {id: 'somevalue'}, 'Base')
assert.equal(insert.ok, 'insert')
const del = await DB.delete('Base:Test1')
assert.equal(del.ok, 'delete')
const insert2 = await DB.insert('Base:Test2', { id: 'somevalue' }, 'Base')
assert.equal(insert2.ok, 'insert')
const update = await DB.update('Base:Test2', { id: 'somevalue2' }, 'Base')
assert.equal(update.ok, 'update')
await DB.delete('Base:Test2')

Test:
> npm test
 
Keep server running after test:
> npm test keepalive

Or just start a server, and open a browser to index.html
> routes=routes.mjs npx instaserve
````