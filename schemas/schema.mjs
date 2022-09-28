const schema = {
  "_fieldtype_date": {
    create: x => new Date().toISOString(),
    enforce: x => (new Date(x) !== 'invalid date')
  },
  "Base": {
    "id": "string",
    "name": "string",
    "type": "string",
    "created": "date",
    "updated": "date"
  }
}

export default schema
globalThis.schema = schema