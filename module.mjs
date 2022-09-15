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
          const required_type = base[k] || base[k+'?']
          if (!required_type) 
              return {ok: false, error: `required field ${k} not in type "${type}"`}
          if (typeof value !== required_type) {
                const custom = this.schema['_fieldtype_' + required_type]?.enforce
                if(!custom) 
                  return { ok: false, error: `a custom type for ${typename} does not exist`}
                if(!custom(value)) 
                  return { ok: false, error: `value: ${value} not valid for custom type "${type}"` }
          }
        }
        for(let field in base) {
          if(field === '_extends')
            continue
          const isOptional = field.endsWith('?')
          const required_type = base[field] || base[field + '?']
          const custom_value = this.schema['_fieldtype_' + required_type]?.create()
          const custom_valid = this.schema['_fieldtype_' + required_type]?.enforce
          const real_field_name = field.replace('?', '')
          const value = obj[real_field_name]
          if (custom_value) {
            obj[real_field_name] = custom_value
            continue
          }
          if (!isOptional && (typeof value === 'undefined')) {
            return { ok: false, error: `required field ${field} does not exist` }
          }
          if (value && !custom_valid && (typeof value !== required_type)) {
            return { ok: false, error: `field ${real_field_name} is not type ${required_type}` }
          }
          if (value && custom_valid && !custom_valid(value)) {
            return { ok: false, error: `value ${value} is not type ${required_type}` }
          }
        }
        return {ok: obj}
    }
}

export { Schema }