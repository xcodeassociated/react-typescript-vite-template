import { ColumnDef } from '@tanstack/react-table'
import { User, UserInput } from '@/pages/users/api/usersApi.types'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserDialog } from '@/pages/users/components/user-dialog'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'
import { useRolesGraphql } from '@/pages/users/hooks/useRolesGraphql'
import { usersApi } from '@/pages/users/api/usersApi.ts'

const parse = (data: User): UserInput => {
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
    version: data.version,
  }
}

export const useUserColumns = () => {
  const { roles } = useRolesGraphql()
  const [updateUser] = usersApi.useUpdateUserMutation()
  const [deleteUser] = usersApi.useDeleteUserMutation()
  const { t } = useTranslation(['main'])

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: '_id',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t(`users.id`, { ns: ['main'] })}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'name',
      header: `${t(`users.name`, { ns: ['main'] })}`,
    },
    {
      accessorKey: 'email',
      header: `${t(`users.email`, { ns: ['main'] })}`,
    },
    {
      accessorKey: 'role',
      header: () => <div className="font-bold">{`${t(`users.role`, { ns: ['main'] })}`}</div>,
      cell: ({ row }) => {
        const formatted = row.original.role.map((role) => role.name).join(', ')
        return <div className="">{formatted}</div>
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex">
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <UserDialog
                    data={parse(user)}
                    roles={roles ? roles : []}
                    submit={(data) => {
                      updateUser(data).then(() => {})
                    }}
                  >
                    <Label className="group m-0 inline-flex w-full rounded-md bg-background px-2 py-2 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                      {t(`users.update`, { ns: ['main'] })}
                    </Label>
                  </UserDialog>
                  <Label
                    className="group m-0 inline-flex w-full rounded-md bg-background px-2 py-2 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    onClick={() => deleteUser(user._id!)}
                  >
                    {t(`users.delete`, { ns: ['main'] })}
                  </Label>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      },
    },
  ]

  return columns
}
