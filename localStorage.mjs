import { eSchema, str, obj } from './module.mjs'

export class LocalStorageDB extends eSchema {
    constructor(schema) {
        super(schema)
    }
    insert(id, o, type) {
        this.validate(o, type)
        if (localStorage.getItem(id)) 
          throw new Error(`localStorage.insert(): ${id} exists`)
        localStorage.setItem(id, str(o))
        return {ok: 'insert'}
    }
    update(id, o, type) {
        this.validate(o, type)
        if (!localStorage.getItem(id)) 
          throw new Error(`localStorage.update(): ${id} does not exist`)
        localStorage.setItem(id, str(o))
        return {ok: 'update'}
    }
    get(id) {
        return JSON.parse(localStorage.getItem(id))
    }
    delete(id) {
        if (!localStorage.getItem(id)) 
          throw new Error(`localStorage.delete(): ${id} does not exist`)
        localStorage.removeItem(id)
        return {ok: 'delete'}
    }
    async insertElements(rectype, selector) {
        const obj = {}
        let id
        var namekey
        const qs = document.querySelectorAll(selector)
        if (!qs.length) throw new Error(`no elements could be found for selector: ${selector}`)
        for (const element of qs) {
            const [ename, evalue, id] = [element.getAttribute('name'), this.convertVals(element), element.getAttribute('recid')]
            if (!ename) continue
            obj[ename] = evalue
            console.log(`serializing element ${ename} = ${evalue}, (record) id = ${id}`)
            if (ename === 'name') {
                namekey = evalue
            }
        }
        if (!id) {
            console.log(`namekey: ${namekey}`)
            if (!namekey) throw new Error('db.insertElements() an element with attribute name must be provided')
            id = `${rectype}:${namekey}`
        }
        if (!Object.keys(obj).length) {
            throw new Error(`db.insertElements() no elements found for selector ${selector}`)
        }
        console.log(`db.insertElements is ${str(obj)}`)
        return await this.insert(id, obj, rectype)
    }
}

globalThis.db = new LocalStorageDB(schema)
