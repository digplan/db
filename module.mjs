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
          const custom_valid = this.schema['_fieldtype_' + required_type]?.enforce
          if (!required_type) 
            throw new Error(`required field ${k} not in type "${type}"`)
          if (custom_valid && !custom_valid(value))
            throw new Error(`value: ${value} not valid for custom field type "${required_type}"`)
          if (!custom_valid && (typeof value !== required_type))
            throw new Error(`value: ${value} not valid for field type "${required_type}"`)
        }
        for(let field in base) {
          if(field === '_extends') continue
          const isOptional = field.endsWith('?')
          const real_field_name = field.replace('?', '')
          const type = base[field] || base[field+'?']
          const custom_value = this.schema['_fieldtype_' + type]?.create
          const custom_valid = this.schema['_fieldtype_' + type]?.enforce
          if (!(real_field_name in obj) && !custom_value && !isOptional)
            throw Error(`field ${real_field_name} does not exist in object`)
          if (!(real_field_name in obj) && custom_value) {
            const value = custom_value(obj)
            if(custom_valid && !custom_valid(value))
              throw Error(`created value ${value} for field type ${type} could not be validated`)
            obj[real_field_name] = value
          }
        }
        return obj
    }
}

export { Schema }