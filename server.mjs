import http from 'node:http'
import { writeFileSync } from 'node:fs'
import Validator from './module.mjs'
import schema from './test-schema.mjs' 
import db from './db.json' assert {type: 'json'}


const { debug } = process.env
const { queries, validate } = new Validator(schema)

http.createServer(({method, headers, url}, s) => {
  try {
    console.log('REQUEST', method, url)
    const [host, prefixapi, action, p, p2] = url.split('/')

    if(!action) throw Error()

    if(debug) console.log('url is ', action, p, p2)
    
    if(action == 'get') {
      if(v && !k && db[v]) 
        return s.end(JSON.stringify(db[v]))
      if(k && v && queries[k])
        return s.end(JSON.stringify(queries[k](v)))
    }
     
    if((action == 'insert' && !db[p]) || (action == 'update' && db[p])) {
      let data = JSON.parse(unescape(p2))
      const [type, id] = p.split(':')
      data = validate(data, type)
      db[p] = data
      writeFileSync('./db.mjs', 'export default ' + JSON.stringify(db, null, 2))
      return s.end('ok')         
    }
                   
    if(action == 'DELETE' && v && db[v])
      return (delete db[v] && s.end('ok'))
      
    if(url === '/client.js') {
    }
                   
    throw Error('404')
    
  } catch(e) {
    s.end(e.message)      
  }
                 
}).listen(3000)
