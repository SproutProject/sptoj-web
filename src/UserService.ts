interface User {
  uid: number,
  name: string
}

export let self: null | User = null

export function initialize(user: User) {
  self = user;
}