function d() {
    throw Error('my err')
}

import { strict as assert } from 'node:assert'
assert.throws(d, /my/)