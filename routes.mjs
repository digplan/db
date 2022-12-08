import FS from 'node:fs'
const db = JSON.parse(FS.readFileSync('./db.json').toString('utf8'))
const tokens = {'mytoken': true}

export default {
    _: (r, s) => { 
        r.key = r.url.split('/').pop(); 
        if(!r.url.match(/login|logout/) && !tokens[r.headers.t])
          throw Error('auth')
    },

    insert: ({ key }, s, data) => {
        db[key] = data
        FS.writeFileSync('./db.json', JSON.stringify(db, null, 2))
    },
    update: ({ key }, s, data) => {
        if (!db[key]) throw Error('not found')
        db[key] = data
        FS.writeFileSync('./db.json', JSON.stringify(db, null, 2))
    },
    delete: ({ tok, key }) => {
        if (!db[key]) throw Error('not found')
        delete db[key]
        FS.writeFileSync('./db.json', JSON.stringify(db, null, 2))
    },
    get: ({ key }) => {
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