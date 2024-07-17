import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Languages, LogOut, Settings, User, UserCircle, UserPlus } from 'lucide-react'
import { useKeycloak } from '@react-keycloak/web'
import { useTranslation } from 'react-i18next'

export interface UserDropdownMenuProps {
  handleDropdownSelectFn: (action: string) => void
}

export function UserDropdownMenu({ handleDropdownSelectFn }: UserDropdownMenuProps) {
  const { keycloak } = useKeycloak()
  const { t } = useTranslation(['main'])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      {keycloak.authenticated ? (
        <>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('user_dropdown.my_account', { ns: ['main'] })}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleDropdownSelectFn('profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>{t('user_dropdown.profile', { ns: ['main'] })}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleDropdownSelectFn('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('user_dropdown.settings', { ns: ['main'] })}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Languages className="mr-2 h-4 w-4" />
                <span>{t('user_dropdown.select_language', { ns: ['main'] })}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onSelect={() => handleDropdownSelectFn('lang/english')}>
                    <span>{t('user_dropdown.en', { ns: ['main'] })}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDropdownSelectFn('lang/polish')}>
                    <span>{t('user_dropdown.pl', { ns: ['main'] })}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                keycloak.logout()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('user_dropdown.logout', { ns: ['main'] })}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      ) : (
        <>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Languages className="mr-2 h-4 w-4" />
                <span>{t('user_dropdown.select_language', { ns: ['main'] })}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onSelect={() => handleDropdownSelectFn('lang/english')}>
                    <span>{t('user_dropdown.en', { ns: ['main'] })}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDropdownSelectFn('lang/polish')}>
                    <span>{t('user_dropdown.pl', { ns: ['main'] })}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                keycloak.login()
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>{t('user_dropdown.login', { ns: ['main'] })}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => keycloak.register()}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>{t('user_dropdown.register', { ns: ['main'] })}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  )
}
