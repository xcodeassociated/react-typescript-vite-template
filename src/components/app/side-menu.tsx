import { MenuItem } from '@/components/app/menu-item'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router'

function SideMenuItem({ item }: { item: MenuItem }) {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <SheetClose asChild>
      <Label
        className={
          (location.pathname === item.route ? 'text-xl' : 'text-xl text-muted-foreground') +
          ' cursor-pointer rounded border bg-muted p-2 hover:text-foreground'
        }
        onClick={() => navigate(item.route)}
      >
        {item.key}
      </Label>
    </SheetClose>
  )
}

export interface SideMenuItemProps {
  items: MenuItem[]
  authenticated: boolean
}

export function SideMenu({ items, authenticated }: SideMenuItemProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-3 text-lg font-normal">
          <SheetTitle className="flex items-center gap-2 text-3xl font-semibold">Shadcn</SheetTitle>
          <SheetDescription>
            <span className="sr-only">Navigation menu</span>
          </SheetDescription>
          {items
            .filter((item) => (item.restricted ? authenticated : true))
            .map((item) => (
              <SideMenuItem key={item.key} item={item} />
            ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
