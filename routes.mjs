import Validator from './module.mjs'
import schema from './test-schema.mjs' 
import db from './db.json' assert {type: 'json'}
import { save } from 'instax'

const { debug, port, routes } = process.env
const v = new Validator(schema)

export default {
  api: ({url}) => {
    const [, , action, p, p2] = url.split('/')
    
    if(action == 'get') {
      if(p && db[p]) 
        return JSON.stringify(db[p])
    }
     
    if((action == 'insert' && !db[p]) || (action == 'update' && db[p])) {
      let data = JSON.parse(unescape(p2))
      const [type, id] = p.split(':')
      data = v.validate(data, type)
      db[p] = data
      save(db, './db.json')
      return 'ok ' + action       
    }
               
    if(action == 'delete') {
      delete db[p]
      save(db, './db.json')
      return 'ok delete'
    }
  }
}