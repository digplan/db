import FS from 'node:fs'
const db = JSON.parse(FS.readFileSync('./db.json').toString('utf8'))
const tokens = {}

export default {
    _: (r) => { r.key = r.url.split('/').pop(); r.tok = r.headers.t },
    insert: ({ headers, key }, s, data) => {
        if(!tokens[r.tok]) throw Error('not auth')
        db[key] = data
        FS.writeFileSync('./db.json', JSON.stringify(db, null, 2))
        return data
    },
    update: (r, s, d) => {
        if (!db[r.key]) throw Error('not found')
        return this.insert(r, s, d)
    },
    delete: ({ headers, key }) => {
        if(!tokens[r.tok]) throw Error('not auth')
        const ok = delete db[key]
        FS.writeFileSync('./db.json', JSON.stringify(db, null, 2))
        return ok
    },
    get: ({ key }) => {
        if(!tokens[r.tok]) throw Error('not auth')
        return db[key]
    },
    login: ({ headers }) => {
        if(headers.authorization!=='test') return 'failed'; 
        const s = Math.random();
        tokens[s] = 'ok';
        return s;
    },
    logout: ({ headers }) => delete tokens[headers.t]
}