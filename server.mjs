import 'http' from 'node:http'
import { writeFileSync } from 'node:fs'
import Schema from './schema.mjs'
import db from './db.mjs'
const { debug } = process.env
const { _queries as queries, validate } = new Schema()

http.createServer(({method, headers, url}, s) => {
  try {
    console.log(method, url)
    const [null, prefix, action, param, param2] = url.split('/')
    if(debug) console.log('url is ', prefix, action, param)
    
    if(method == 'GET') {
      if(debug) console.log(`GET request for key ${param}`)
      if(v && !k && db[v]) 
        return s.end(JSON.stringify(db[v]))
      if(k && v && queries[k])
        return s.end(JSON.stringify(queries[k](v))
    }
    
    if(headers?.data && v && ((method=='POST' && !db[v]) || (method=='PUT' && db[v])) {
      const data = JSON.parse(headers.data)
      data = validate(data, data.type)
      db[k] = data
      writeFileSync('./db.mjs', 'export default ' + JSON.stringify(db, null, 2))
      return s.end('ok')         
    }
                   
    if(method == 'DELETE' && v && db[v])
      return (delete db[v] && s.end('ok'))
      
    if(url === '/client.js') {
      return s.end(`
         window.db = async (action, param, param2, o) => {
            const u = `/api/${param}` + (param2 ? `/${param2}` : '')
            const f = await fetch(u, {method: action, headers: {data: JSON.stringify(o)}})
            const j = await f.json()
            if(action.match(/POST|PUT/i) && j !== 'ok')
              throw Error(`error: ${action} returned ${j}`)
            return j
         }
      `) 
    }
                   
    throw Error(404)
    
  } catch(e) {
    s.writeHead(e).end(e)      
  }
                 
}).listen(3000)
