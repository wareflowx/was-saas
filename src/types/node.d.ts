declare module 'better-sqlite3' {
  const Database: any
  export default Database
}

declare module 'xlsx' {
  export function read(data: ArrayBuffer | Buffer, options?: { type: 'array' | 'buffer' }): {
    SheetNames: string[]
    Sheets: Record<string, any>
  }

  export const utils: {
    sheet_to_json(sheet: any, options?: {
      header?: 1 | any[]
      raw?: boolean
      defval?: any
    }): unknown[][]
  }

  const xlsx: any
  export default xlsx
}
