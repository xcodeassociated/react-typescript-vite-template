import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Page } from './api/usersApi.types'
import { useTranslation } from 'react-i18next'
import { useRolesGraphql } from './hooks/useRolesGraphql'
import { PayloadAction } from '@reduxjs/toolkit'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { DataTable } from '@/components/custom/data-table'
import { UserDialog } from './components/user-dialog'
import { useUserColumns } from '@/pages/users/hooks/useColumns'
import { LoadingScreenMemo } from '@/components/app/loading-screen'
import { usersApi } from '@/pages/users/api/usersApi.ts'

const buildPage = (pagination: PaginationState, sorting: SortingState): Page => {
  return new Page(pagination.pageIndex, pagination.pageSize, sorting[0].id, sorting[0].desc ? 'DESC' : 'ASC')
}

const toPayload = (data: Page): PayloadAction<{ page: number; pageSize: number; sort: string; direction: string }> => {
  return { payload: { page: data.page, pageSize: data.pageSize, sort: data.sort, direction: data.direction }, type: '' }
}

export const Users: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = React.useState<SortingState>([{ id: '_id', desc: false }])

  const { roles } = useRolesGraphql()
  const users = usersApi.useGetAllUsersQuery(toPayload(buildPage(pagination, sorting)))
  const size = usersApi.useGetUsersSizeQuery()
  const [createUser] = usersApi.useCreateUserMutation()
  const { t } = useTranslation(['main'])
  const columns = useUserColumns()

  if (users.isLoading) {
    return <LoadingScreenMemo />
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t(`users.t1`, { ns: ['main'] })}</CardTitle>
          <CardDescription>{t(`users.t2`, { ns: ['main'] })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <>
              <UserDialog
                data={undefined}
                roles={roles ? roles : []}
                submit={(data) => {
                  createUser(data).then(() => {})
                }}
              >
                <Button variant="outline" className="my-4 ml-auto flex-1">
                  {t(`users.add`, { ns: ['main'] })}
                </Button>
              </UserDialog>
            </>
            <>
              <DataTable
                columns={columns}
                data={
                  users.data
                    ? users.data?.map((e) => {
                        return { ...e, key: e._id }
                      })
                    : []
                }
                total={size.data ? size.data : 0}
                pagination={pagination}
                paginationChangeFn={setPagination}
                sorting={sorting}
                sortingChangeFn={setSorting}
              />
            </>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
