import file from './schema.mjs'

class Schema {
    schema
    constructor(def) {
        this.schema = def || file
    }
    validate(obj, type) {
        // Get validator def
        let validator = this.schema[type]
        if(!validator) throw Error(`provided type ${type} does not exist in schema`)
        const base = this.schema[validator?._extends] || {}
        Object.assign(base, validator)
        // Check provided obj
        for(let k in obj) {
            const value = obj[k]
            if(!base[k] && !base[k].endsWith('?')) 
              return {ok: false, error: `required field ${k} not in type "${type}"`}
            const typename = base[k].replace('?', '')
            if(typeof value !== typename) {
                const custom = base['_fieldtype_' + typename].enforce
                if(!custom) 
                  return { ok: false, error: `a custom type for ${typename} does not exist`}
                if(!custom(value)) 
                  return { ok: false, error: `${value} not valid for custom type "${type}"` }
            }
        }
        for(let bk in base) {
            const custom_create = base['_fieldtype_' + base[bk]]?.create
            if(!obj[bk]) {
              if(!custom_create && !bk.endsWith('?'))
                return { ok: false, error: `required field ${bk} does not exist in object` }
              obj[bk] = custom_create()
            }
        }
        return {ok: obj}
    }
}

export { Schema }