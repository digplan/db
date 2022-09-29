import { eSchema as Validator } from './module.mjs'
import schema from './public/schemas/test-schema.mjs' 
import db from './data/db.json' assert {type: 'json'}
import { isJSON, save } from 'instax'

const { debug, port, routes } = process.env
const v = new Validator(schema)

export default {
  api: ({url}) => {
    const [, , action, p, p2] = url.split('/')
    
    if(action == 'get') {
      if(p && db[p]) 
        return JSON.stringify(db[p])
      throw Error(`get ${p} not found`)
    }
     
    if((action == 'insert' && !db[p]) || (action == 'update' && db[p])) {
      if(!p2) throw Error(`${action} object not provided`)
      isJSON(p2)
      let data = JSON.parse(unescape(p2))
      const [type, id] = p.split(':')
      data = v.validate(data, type)
      db[p] = data
      save(db, './data/db.json')
      return { ok: action }      
    }
               
    if(action == 'delete') {
      if(!db[p]) throw Error(`delete "${p}" not found`)
      delete db[p]
      save(db, './data/db.json')
      return { ok: action }
    }

    throw Error('invalid call ' + action + ' for ' + p + ', ' + p2)
  },
  schema: () => schema
}