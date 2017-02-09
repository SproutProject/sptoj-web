export enum UserLevel {
  user = 3,
  kernel = 0,
}

export interface User {
  uid: number,
  name: string,
  level: UserLevel,
}

export let login: boolean = false
export let identity: User = { uid: -1, name: '', level: -1 }

export function initialize(user: User) {
  login = true
  identity = user
}
