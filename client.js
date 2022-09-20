// db('GET', 'test:test')
// db('QUERY', 'users', 'param')
// db('POST', 'test:test2'. {})
// db('PUT', 'test:test2'. {})
// db('DELETE', 'test:test2')

window.db = async (action, param, param2, o) => {
    const u = `/api/${param}` + (param2 ? `/${param2}` : '')
    const f = await fetch(u, { method: action, headers: { data: JSON.stringify(o) } })
    const j = await f.json()
    if (action.match(/POST|PUT|DELETE/i) && j !== 'ok')
        throw Error(`error: ${action} returned ${j}`)
    return j
}