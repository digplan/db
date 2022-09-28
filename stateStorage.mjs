import { eSchema } from './module.mjs'

class StateDB extends eSchema {
    constructor(schema) {
        super(schema)
    }
    insert(id, o, type) {
        this.validate(o, type)
        if (state[id]) throw Error('exists')
        state[id] = o
    }
    update(id, o, type) {
        this.validate(o, type)
        if (!state[id]) throw Error('does not exist')
        state[id] = o
    }
    get(id) {
        return state[id]
    }
    delete(id) {
        delete state[id]
    }
}

export default StateDB
globalThis.StateDB = StateDB