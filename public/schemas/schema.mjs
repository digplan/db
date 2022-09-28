const schema = {

  _fieldtype_date: {
    create: x => new Date().toISOString(),
    enforce: x => (new Date(x) !== 'invalid date')
  },
  _fieldtype_color: {
    enforce: s => s.match(/^#[A-F0-9]{6}/)
  },

  Base: {
    "id": "string",
    "name": "string",
    "type": "string",
    "created": "date",
    "updated": "date",
    "color": "color",
    "tf": "boolean"
  }

}

export default schema
globalThis.schema = schema