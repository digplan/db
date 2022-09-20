// db('GET', 'test:test')
// db('QUERY', 'users', 'param')
// db('POST', 'test:test2'. {})
// db('PUT', 'test:test2'. {})
// db('DELETE', 'test:test2')

window.db = async (action, param, param2={}) => {
    param2 = JSON.stringify(param2)
    const u = `/api/${action}/${param}` + (param2 ? `/${param2}` : '')
    const f = await fetch(u)
    const j = await f.json()
    if (action.match(/insert|update|delete/i) && !j.match(/^ok /i))
        throw Error(`error: ${action} returned ${j}`)
    return j
}