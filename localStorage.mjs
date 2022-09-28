import { eSchema } from './module.mjs'

class LocalStorageDB extends eSchema {
    constructor(schema) {
        super(schema)
    }
    insert(id, o, type) {
        this.validate(o, type)
        if (localStorage.getItem(id)) throw Error('exists')
        localStorage.setItem(id, JSON.stringify(o))
    }
    update(id, o, type) {
        this.validate(o, type)
        if (!localStorage.getItem(id)) throw Error('does not exist')
        localStorage.setItem(id, JSON.stringify(o))
    }
    get(id) {
        return JSON.parse(localStorage.getItem(id)?.toString())
    }
    delete(id) {
        return localStorage.removeItem(id)
    }
}

export default LocalStorageDB
globalThis.LocalStorageDB = LocalStorageDB
