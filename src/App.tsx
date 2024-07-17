import React, { createContext } from 'react'
import { Counter } from '@/pages/counter/Counter'
import { useKeycloak } from '@react-keycloak/web'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MenuItem } from '@/components/app/menu-item'
import { Label } from '@radix-ui/react-menu'
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu'
import { NavMenuItem } from '@/components/app/nav-item'
import { MessageSquare, Search } from 'lucide-react'
import { ModeToggle } from '@/components/custom/mode-toggle'
import { Input } from '@/components/ui/input'
import { UserDropdownMenu } from '@/components/app/user-dropdown-menu'
import { Errors, Unauthorized } from '@/pages/error/errors.tsx'
import { Home } from '@/pages/home/home'
import { SideMenu } from '@/components/app/side-menu'
import { Users } from '@/pages/users/Users'
import { setLanguage } from '@/locales/i18n'
import CookieConsent from '@/components/custom/coockie-consent'
import { LoadingScreenMemo } from '@/components/app/loading-screen'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
const ProtectedRoute = ({ predicate, redirectPath = '/', children }) => {
  if (!predicate) {
    return <Navigate to={redirectPath} replace />
  }
  return children
}

export type GlobalSettings = {
  data?: string
}

const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  console.log(`search: ${e.currentTarget.search.value}`)
  e.currentTarget.reset()
}

const handleCookieConsentAccept = () => {
  console.log(`Cookie consent ACCEPTED`)
}

const handleCookieConsentDecline = () => {
  console.log(`Cookie consent DECLINED`)
}

const defaultGlobalSettings: GlobalSettings = { data: 'some-global-data' }
export const GlobalSettingsContext = createContext<GlobalSettings>(defaultGlobalSettings)

const App: React.FC = () => {
  const { initialized, keycloak } = useKeycloak()
  const navigate = useNavigate()
  const { t } = useTranslation(['main'])

  const menuItems: MenuItem[] = [
    {
      key: `${t('menu.home', { ns: ['main'] })}`,
      route: '/',
      restricted: false,
    },
    {
      key: `${t('menu.counter', { ns: ['main'] })}`,
      route: '/counter',
      restricted: true,
    },
    {
      key: `${t('menu.users', { ns: ['main'] })}`,
      route: '/users',
      restricted: true,
    },
  ]

  const handleUserDropdownSelect = (item: string) => {
    console.log(`User dropdown change: ${item}`)
    switch (item) {
      case 'profile':
        console.log('Profile')
        break
      case 'settings':
        console.log('Settings')
        break
      case 'lang/english':
        setLanguage('en')
        break
      case 'lang/polish':
        setLanguage('pl')
        break
      default:
        throw Errors('Unsupported action')
    }
  }

  if (!initialized) {
    return <LoadingScreenMemo />
  }

  return (
    <GlobalSettingsContext.Provider value={{ data: defaultGlobalSettings.data }}>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Label
              className="flex cursor-pointer items-center gap-2 text-lg font-semibold md:text-base"
              onClick={() => navigate('/')}
            >
              {t(`app.name`, { ns: ['main'] })}
              <span className="sr-only">Logo</span>
            </Label>
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems
                  .filter((item) => (item.restricted ? keycloak.authenticated : true))
                  .map((item) => (
                    <NavMenuItem key={item.key} item={item} />
                  ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
          <SideMenu items={menuItems} authenticated={keycloak.authenticated ? keycloak.authenticated : false} />
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial" onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder={t('menu.search', { ns: ['main'] })}
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
            <div>
              <ModeToggle />
            </div>
            <UserDropdownMenu handleDropdownSelectFn={handleUserDropdownSelect} />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <div className="grid w-full grid-cols-1 content-start items-center justify-center gap-4">
            <div className="col-span-1">
              <div className="text-4xl font-bold">{t(`home.section1`, { ns: ['main'] })}</div>
              <div className="text-lg text-muted-foreground">{t(`home.section2`, { ns: ['main'] })}</div>
            </div>
            <Routes>
              <Route path="*" element={<Errors />} />
              <Route path="/" element={<Home />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/counter"
                element={
                  <ProtectedRoute predicate={keycloak?.authenticated} redirectPath={'/unauthorized'}>
                    <Counter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute predicate={keycloak?.authenticated} redirectPath={'/unauthorized'}>
                    <Users />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <CookieConsent onAcceptCallback={handleCookieConsentAccept} onDeclineCallback={handleCookieConsentDecline} />
        </main>
        <footer className="flex h-16 items-center justify-center border-t bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-5 w-5" />
            <span className="text-muted-foreground">{t(`footer.text`, { ns: ['main'] })}</span>
          </div>
        </footer>
      </div>
    </GlobalSettingsContext.Provider>
  )
}

export default App
