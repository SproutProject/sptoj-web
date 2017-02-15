export enum UserLevel {
  user = 3,
  kernel = 0,
}

export enum UserCategory {
  universe = 0,
  algo = 1,
  clang = 2,
  pylang = 3,
}

export interface User {
  uid: number,
  name: string,
  level: UserLevel,
  category: UserCategory,
  metadata: void,
}

export let login: boolean = false
export let identity: User | null = null

export function initialize(user: User) {
  login = true
  identity = user
}
