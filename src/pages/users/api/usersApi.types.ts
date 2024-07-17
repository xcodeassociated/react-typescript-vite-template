export interface Role {
  readonly _id: string | undefined
  name: string
  description: string

  version: number | undefined
  createdBy: string | undefined
  createdDate: string | undefined
  modifiedBy: string | undefined
  modifiedDate: string | undefined
}

export interface User {
  readonly _id: string | undefined
  name: string
  email: string
  role: Role[]

  version: number | undefined
  createdBy: string | undefined
  createdDate: string | undefined
  modifiedBy: string | undefined
  modifiedDate: string | undefined
}

export interface UserInput<T = Role[]> {
  _id: string | undefined
  name: string
  email: string
  role: T
  version: number | undefined
}

export type UserInputDto = UserInput<string[]>

export class Page {
  page: number
  pageSize: number
  sort: string
  direction: string

  constructor(page: number = 0, pageSize: number = 10, sort: string = 'id', direction: string = 'ASC') {
    this.page = page
    this.pageSize = pageSize
    this.sort = sort
    this.direction = direction
  }
}
