import { beforeAll, afterAll, afterEach, describe, expect, it, vitest } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React, { act } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { GetAllPermissionsDocument } from '@/graphql/generated'
import { store } from '@/store/store'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { usersApi } from './api/usersApi'
import { Provider } from 'react-redux'
import '@/locales/i18n'
import { ThemeProvider } from '@/components/theme-provider'

// Mock the roles GraphQL hook to provide static role data
vi.mock('./hooks/useRolesGraphql', () => ({
  useRolesGraphql: () => ({
    roles: [
      {
        _id: '63c16ce71ba30e5f08b4d66e',
        name: 'GUEST',
        description: 'Anonymous user who can only read info',
        version: undefined,
        createdBy: undefined,
        createdDate: undefined,
        modifiedBy: undefined,
        modifiedDate: undefined,
      },
    ],
    loading: false,
    error: undefined,
  }),
}))

import { MockedProvider } from '@apollo/client/testing/react'

const mockedRolesGql = {
  request: {
    query: GetAllPermissionsDocument,
    variables: {
      page: 0,
      size: 10,
      sort: 'id',
      direction: 'ASC',
    },
  },

  result: {
    data: { getAllPermissions: [{ id: '63c16ce71ba30e5f08b4d66e', name: 'GUEST' }] },
  },
}

const mockedUsers = [
  {
    _id: '63c16cfe1ba30e5f08b4d66f',
    name: 'John Snow',
    email: 'john.snow@email.com',
    role: [
      {
        description: 'Anonymous user who can only read info',
        _id: '63c16ce71ba30e5f08b4d66e',
        name: 'GUEST',
      },
    ],
  },
]

export const handlers = [
  http.get(import.meta.env.VITE_APP_BACKEND_URL + '/coroutine/users', () => {
    return HttpResponse.json(mockedUsers)
  }),
  http.get(import.meta.env.VITE_APP_BACKEND_URL + '/coroutine/usersCount', () => {
    return HttpResponse.json(1)
  }),
]

export const server = setupServer(...handlers)

server.events.on('request:start', ({ request }) => {
  console.debug('MSW Outgoing:', request.method, request.url)
})

describe('user component tests', () => {
  beforeAll(() => {
    ;(global as any).EventSource = class {
      url: string
      readyState = 1
      addEventListener = vitest.fn()
      removeEventListener = vitest.fn()
      close = vitest.fn()
      dispatchEvent = vitest.fn()
      onopen: ((ev: Event) => void) | null = null
      onmessage: ((ev: MessageEvent) => void) | null = null
      onerror: ((ev: Event) => void) | null = null
      constructor(url: string) {
        this.url = url
      }
    }

    server.listen()
    act(() => store.dispatch(usersApi.util.resetApiState()))
  })

  afterEach(() => {
    server.resetHandlers()
    act(() => store.dispatch(usersApi.util.resetApiState()))
  })

  afterAll(() => {
    delete (global as any).EventSource
    server.close()
  })

  it('renders users component', async () => {
    const { Users } = await import('./Users')
    await act(async () =>
      render(
        <React.StrictMode>
          <ThemeProvider>
            <Provider store={store}>
              <BrowserRouter>
                <MockedProvider mocks={[mockedRolesGql]}>
                  <Users />
                </MockedProvider>
              </BrowserRouter>
            </Provider>
          </ThemeProvider>
        </React.StrictMode>
      )
    )

    await waitFor(() => {
      expect(screen.getByText(/John Snow/i)).toBeInTheDocument()
      expect(screen.getByText(/john.snow@email.com/i)).toBeInTheDocument()
      expect(screen.getByText(/GUEST/i)).toBeInTheDocument()
    })
  })
})
