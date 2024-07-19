import { describe, expect, it, vi, beforeAll } from 'vitest'
import React, { act } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Provider } from 'react-redux'
import { store } from '@/store/store.ts'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App.tsx'
import Keycloak, { KeycloakProfile } from 'keycloak-js'

function mockUseKeycloak() {
  const token = 'A random string that is non zero length'
  const userProfile: KeycloakProfile = {
    username: 'test',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  }
  const realmAccess = { roles: ['user'] }

  const authClient: Keycloak = {
    authenticated: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasRealmRole(_ignored: string) {
      return true
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasResourceRole(_ignored: string) {
      return true
    },
    idToken: token,
    profile: userProfile,
    realm: 'TestRealm',
    realmAccess,
    refreshToken: token,
    token,
  } as Keycloak
  return { initialized: true, keycloak: authClient }
}

describe('App tests', () => {
  beforeAll(() => {
    vi.mock('@react-keycloak/web', () => ({ useKeycloak: mockUseKeycloak }))
  })
  it('home render with keycloak authorized', async () => {
    await act(async () =>
      render(
        <React.StrictMode>
          <ThemeProvider>
            <Provider store={store}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </Provider>
          </ThemeProvider>
        </React.StrictMode>
      )
    )

    await waitFor(() => {
      // note: menu items shown only after login
      expect(screen.getByText(/counter/i)).toBeInTheDocument()
      expect(screen.getByText(/users/i)).toBeInTheDocument()
    })
  })
})
