class eSchema {
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
          if((real_field_name in obj) && !isOptional && obj[real_field_name] === '') {
            throw Error(`blank value provided for fieldtype ${type} fieldname ${real_field_name}`)
          }
          if ((real_field_name in obj) && !isOptional && obj[real_field_name] === undefined) {
            throw Error(`undefined value provided for fieldtype ${type} fieldname ${real_field_name}`)
          }
        }
        return obj
    }
}

class FetchDB extends eSchema {
  remoteHost = ''
  dontBreakonError = false
  constructor(schema) {
    super(schema)
  }
  async f(url, options) {
    const fet = await fetch(this.remoteHost + url, options)
    const j = await fet.json()
    if(!this.dontBreakonError && j.error) throw new Error('client error: ' + j.error)
    return j
  }
  async insert(id, o, type) {
    this.validate(o, type)
    return await this.f(`/api/insert/${id}/${JSON.stringify(o)}`)
  }
  async update(id, o, type) {
    this.validate(o, type)
    return await this.f(`/api/update/${id}/${JSON.stringify(o)}`)
  }
  async get(id) {
    return await this.f(`/api/get/${id}`)
  }
  async delete(id) {
    return await this.f(`/api/delete/${id}`)
  }

  convertVals(e) {
    if((e.getAttribute('type') === 'checkbox') && e.value.match(/on|off/)) 
      return e.value === 'on' ? true : false
    return e.value
  }

  // <input type=string name='name' value='ok'> { 'name': 'name', 'type': 'string' }
  // <input type=string name='somefield' value='ok2'> { 'name': 'somefield', 'type': 'string' }
  async insertElements(rectype, selector) {
    const obj = {}
    let id
    var namekey
    const qs = document.querySelectorAll(selector)
    if(!qs.length) throw new Error(`no elements could be found for selector: ${selector}`)
    for(const element of qs) {
      const [ename, evalue, id] = [element.getAttribute('name'), this.convertVals(element), element.getAttribute('recid')]
      if(!ename) continue
      obj[ename] = evalue
      console.log(`serializing element ${ename} = ${evalue}, (record) id = ${id}`)
      if(ename === 'name') {
        namekey = evalue
      }
    }
    if(!id) {
      console.log(`namekey: ${namekey}`)
      if (!namekey) throw new Error('db.insertElements() an element with attribute name must be provided')
      id = `${rectype}:${namekey}`
    }
    if(!Object.keys(obj).length) {
      throw new Error(`db.insertElements() no elements found for selector ${selector}`)
    }
    console.log(`db.insertElements is ${JSON.stringify(obj)}`)
    return await this.insert(id, obj, rectype)
  }
}

export { eSchema, FetchDB }
globalThis.eSchema = eSchema
globalThis.FetchDB = FetchDB

if(globalThis?.schema)
  globalThis.db = new FetchDB(globalThis.schema)