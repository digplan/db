export default {
    _fieldtype_newdate: s => {
        enforce: (v) => (new Date(s).toString() !== 'Invalid Date')
        create: () => new Date().toISOString 
    },
    _fieldtype_exdate: s => {
        enforce: (v) => (new Date(s).toString() !== 'Invalid Date')
    },
    Base: {
        id: 'string',
        created: 'newdate',
        updated: 'string'
    },
    TestType: {
        _extends: 'Base',
        name: 'string',
        birthdate: 'exdate'
    }
}