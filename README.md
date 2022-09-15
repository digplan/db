````
Usage:
const s = new Schema()
s.validate({'id': 'cb', 'name': 'cb'}, 'TestType')

schema.mjs:
export default {
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
````