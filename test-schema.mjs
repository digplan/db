export default {
    queries: {
        "all": x => x,
    },
    _fieldtype_newdate: {
        enforce: s => (new Date(s).toString() !== 'Invalid Date'),
        create: o => new Date().toISOString()
    },
    _fieldtype_datetype: {
        enforce: s => (new Date(s).toString() !== 'Invalid Date'),
        create: o => 'xx'
    },
    _fieldtype_isOld: {
        create: o => o < 100
    },
    Base: {
        id: 'string',
        created: 'newdate'
    },
    TestType: {
        _extends: 'Base',
        name: 'string',
        'optional?': 'string'
    },
    TestType2: {
        date: 'datetype',
        'age?': 'number',
        'old?': 'isOld'
    },
    ExtendExtend: {
        _extends: 'TestType',
        'ee': 'string'
    }
}