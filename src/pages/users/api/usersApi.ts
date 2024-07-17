import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User, UserInput, UserInputDto } from './usersApi.types'
import keycloak from '@/lib/keycloak'
import { PayloadAction } from '@reduxjs/toolkit'

const toDto = (data: UserInput): UserInputDto => {
  return [data].map((e): UserInputDto => {
    return {
      _id: e._id,
      name: e.name,
      email: e.email,
      role: e.role.map((r) => r._id!),
      version: e.version,
    }
  })[0]
}

export const usersApi = createApi({
  tagTypes: ['users', 'usersCount'],
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BACKEND_URL + '/coroutine',
    prepareHeaders: (headers) => {
      const token = keycloak.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      User[],
      PayloadAction<{
        page: number
        pageSize: number
        sort: string
        direction: string
      }>
    >({
      query: (arg) =>
        `/users?page=${arg.payload.page}&size=${arg.payload.pageSize}&sort=${arg.payload.sort}&direction=${arg.payload.direction}`,
      providesTags: ['users'],
    }),
    getUsersSize: builder.query<number, void>({
      query: () => `/usersCount`,
      providesTags: ['usersCount'],
    }),
    getUser: builder.query<User, string>({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),
    // note: no optimistic locking here, because we don't know the ID for the new user, so we don't know where to put it
    createUser: builder.mutation({
      query: (data: UserInput) => ({
        url: '/users',
        method: 'POST',
        body: toDto(data),
      }),
      invalidatesTags: ['users', 'usersCount'],
    }),
    updateUser: builder.mutation({
      query: (data: UserInput) => ({
        url: `/users/${data._id}`,
        method: 'PUT',
        body: toDto(data),
      }),
      async onQueryStarted({ _id, name, email, role }, { dispatch, queryFulfilled, getState }) {
        for (const { endpointName, originalArgs } of usersApi.util.selectInvalidatedBy(getState(), [
          { type: 'users' },
        ])) {
          if (endpointName !== 'getAllUsers') continue
          const patchResult = dispatch(
            usersApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
              return draft.map((e): User => {
                if (e._id === _id) {
                  return { ...e, name: '' + name, email: email, role: role }
                } else {
                  return e
                }
              })
            })
          )
          try {
            await queryFulfilled
          } catch {
            patchResult.undo()
          }
        }
      },
      invalidatesTags: ['users', 'usersCount'],
    }),
    deleteUser: builder.mutation({
      query: (data: string) => ({
        url: `/users/${data}`,
        method: 'DELETE',
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled, getState }) {
        for (const { endpointName, originalArgs } of usersApi.util.selectInvalidatedBy(getState(), [
          { type: 'users' },
        ])) {
          if (endpointName !== 'getAllUsers') continue
          const patchResult = dispatch(
            usersApi.util.updateQueryData(endpointName, originalArgs, (draft) => draft.filter((e) => e._id !== data))
          )
          try {
            await queryFulfilled
          } catch {
            patchResult.undo()
          }
        }
      },
      invalidatesTags: ['users', 'usersCount'],
    }),
  }),
})
