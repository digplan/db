const schema = {
  "_fieldtype_date": {
    create: x => new Date().toISOString(),
    enforce: x => (new Date(x) !== 'invalid date')
  },
  "Base": {
    "type": "string",
    "name": "string",
    "created": "date",
    "updated": "date"
  }
}

export default schema
globalThis.schema = schema