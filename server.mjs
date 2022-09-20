import 'http' from 'node:http'
import { writeFileSync } from 'node:fs'
import queries from './queries.mjs'
import schema from './schema.mjs'
import db from './db.mjs'
const { debug } = process.env

const validate = new schema()

http.createServer(({method, headers, url}, s) => {
  try {
    console.log(method, url)
    const [k, v] = url.slice(-2)
    if(debug) console.log('url is ', [k, v])
    
    if(method == 'GET') {
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
      return JSON.stringify(db[k])          
    }
                   
    if(method == 'DELETE' && v && db[v])
      return (delete db[v] && s.end('ok'))
                   
    throw Error(404)
    
  } catch(e) {
    s.writeHead(e).end(e)      
  }
                 
}).listen(3000)
