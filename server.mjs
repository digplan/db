import http from 'node:http'
import Validator from './module.mjs'
import schema from './test-schema.mjs' 
import db from './db.json' assert {type: 'json'}
import { save } from 'instax'

const { debug, port, routes } = process.env
const v = new Validator(schema)

http.createServer(({method, headers, url}, s) => {
    console.log('REQUEST', method, url)
    const [, , action, p, p2] = url.split('/')
    console.log('URL is ', action, p, p2, db[p])
    
    if(action == 'get') {
      if(p && db[p]) 
        return s.end(JSON.stringify(db[p]))
    }
     
    if((action == 'insert' && !db[p]) || (action == 'update' && db[p])) {
      let data = JSON.parse(unescape(p2))
      const [type, id] = p.split(':')
      data = v.validate(data, type)
      db[p] = data
      save(db, './db.json')
      return s.end('ok ' + action)         
    }
               
    if(action == 'delete') {
      delete db[p]
      save(db, './db.json')
      return s.end('ok delete')
    }
      
    s.end('not found')        
}).listen(3000)
