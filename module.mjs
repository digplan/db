class SchemaEngine {
    schema
    constructor(def) {
        if(!def) throw Error('provide a schema definition')
        if(def?._queries) {
            for(const v in def._queries)
                def._queries[v] = eval(def._queries[v])
        }
        this.schema = def
    }
    getSchemaFor(type) {
      if (!this.schema[type]) throw Error(`provided type ${type} does not exist in the schema`)
      let base = { ...this.schema[type] }, tmp = { ...base }, v = tmp = { ...base }
      while (tmp = this.schema[tmp._extends]) {
        for (let k in tmp) 
          if(k !== '_extends') v[k] = tmp[k]
      }
      return v
    }
    validate(obj, type) {
        // Get validator def
        if (!this.schema[type]) throw Error(`provided type ${type} does not exist in the schema`)
        const base = this.getSchemaFor(type)
        // Check provided obj
        for(let k in obj) {
          const value = obj[k]
          const required_type = base[k] || base[k+'?']
          const custom_valid = this.schema['_fieldtype_' + required_type]?.enforce
          if (!required_type) 
            throw new Error(`provided field ${k} = "${obj[k]}" not in type "${type}", ${JSON.stringify(base)}`)
          if (custom_valid && !custom_valid(value))
            throw new Error(`value: "${value}" not valid for field type "${required_type}", schema is ${JSON.stringify(base)}`)
          if (!custom_valid && (typeof value !== required_type))
            throw new Error(`value: "${value}" not valid for field type "${required_type}"`)
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

export default SchemaEngine
