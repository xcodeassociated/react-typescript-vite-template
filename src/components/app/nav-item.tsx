import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router'
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { MenuItem } from '@/components/app/menu-item'

export function NavMenuItem({ item }: { item: MenuItem }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle() + ' cursor-pointer'}
        active={location.pathname === item.route}
        onClick={() => navigate(item.route)}
      >
        {item.key}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
