// example: 2002-01-01T12:00:00.010Z|C|weqweqwe|a=1|b=2
// {filename, nohash = false, notime = false, kvsep = '=', recordsep = '|'}
class flog {
  state = {}
  constructor({ file, nohash = false, notime = false, kv = '=', rs = '|' }) {
    this.params = { file, nohash, notime, kv, rs }
    if (!read(file)) {
      const h = hash('cb')
      const o = this.params
      o.id = '_'
      const s = [this.time(), h, this.serialize(o)].join(rs)
      FS.writeFileSync(this.params.file, s)
    }
    this.build()
  }
  serialize(o) {
    let s = []
    for (let i in o)
      s.push(i + this.params.kv + o[i])
    return s.join(this.params.rs)
  }
  time() {
    return new Date().toISOString()
  }
  c(id, o, action = 'C') {
    if (this.state[id] && action == 'C') throw Error(`${id} Exists`)
    const { file, rs, nohash, notime } = this.params
    o.id = id
    const ostr = this.serialize(o)
    const s = []
    notime || s.push(this.time())
    nohash || s.push(hash(this.cur + ostr))
    s.push(action)
    s.push(ostr)
    appendLn(s.join(rs), file)
    this.state[id] = o
    return 'ok'
  }
  u(id, o) {
    if (!this.state[id]) throw Error(`update() - ${id} exists`)
    this.c(id, o, 'U')
    return 'ok'
  }
  d(id) {
    this.c(id, { id: id }, 'D')
    delete this.state[id]
    return 'ok'
  }
  build(hash) {
    const { notime, nohash, file, rs, kv } = this.params
    read(file).split('\r\n').every(line => {
      const arr = line.split(rs)
      let curhash = ''
      if (!notime) arr.shift()
      if (!nohash) curhash = arr.shift()
      const action = arr.shift()
      if (action == 'D') {
        delete this.state[arr[0].split('=')[1]]
        return (curhash !== hash)
      }
      let o = {}, id
      arr.forEach(item => {
        const [k, v] = item.split('=')
        o[k] = v
        if (k == 'id') id = v
      })
      this.state[id] = o
      return (curhash !== hash)
    })
    return this.state
  }
  routes = {
    _debug: ({ method, url }, s, data) => console.log(method, url, data),
    c: (r, s, data) => this.c(data.id, data),
    r: ({url}) => str(this.state[url.split('/').pop()]),
    u: (r, s, data) => this.u(data.id, data),
    d: (r) => this.d(r.url.split('/').pop())
  }
}

import { save } from '../instax/module.mjs'
class Simple {
  db = new Proxy({}, { set(o, p, v) { Reflect.set(...arguments); return save(o, 'db.json') } })
  routes = {
    c: (r, s, data) => data.id && (this.db[data.id] = data),
    r: ({url}, s, data) => this.db[url.split('/').pop()],
    u: (r, s, data) => this.db[data.id] && (this.db[data.id] = data),
    d: ({ url }, s, data) => this.db[url.split('/').pop()] && delete this.db[url.split('/').pop()],
    q: (r, s, data) => {
      const f = eval(data.q)
      if(!f && (typeof f !== 'function')) return undefined
      return Object.values(this.db).filter(f)
    }
  }
  routes2 = {
    api: ({method}, s, data) => {
      (method === 'POST') && data.id && (this.db[data.id] = data)
      (method === 'PUT') && this.db[data.id] && (this.db[data.id] = data)
      (method === 'DELETE') && this.db[url.split('/').pop()] && delete this.db[url.split('/').pop()]
      (method === 'GET') && data.id && (this.db[data.id] = data)
      (method === 'QUERY') && data.id && (this.db[data.id] = data)
    }
  }
}

export { Simple, flog }
