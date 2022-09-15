export default {
    _fieldtype_newdate: {
        enforce: (s) => (new Date(s).toString() !== 'Invalid Date'),
        create: () => new Date().toISOString()
    },
    Base: {
        id: 'string',
        created: 'newdate'
    },
    TestType: {
        _extends: 'Base',
        name: 'string',
        'optional?': 'string'
    }
}