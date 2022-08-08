declare global {
  export interface ILoader {
    load(): Promise<void>
  }

  export interface PlayerMp {
    databaseId: number
  }
}

export {}
