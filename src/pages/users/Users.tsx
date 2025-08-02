import React, { useEffect, useState } from 'react'
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
import { useSearchParams } from 'react-router-dom'
import { useSimpleSSE } from '@/pages/users/hooks/useSseUsers.tsx'

type UsersSearchParams = {
  page: number
  size: number
  sort: string
  desc: boolean
}

const toString = (params: UsersSearchParams) => {
  return {
    page: `${params.page}`,
    size: `${params.size}`,
    sort: `${params.sort}`,
    desc: `${params.desc}`,
  }
}

const buildPage = (pagination: PaginationState, sorting: SortingState): Page => {
  return new Page(pagination.pageIndex, pagination.pageSize, sorting[0].id, sorting[0].desc ? 'DESC' : 'ASC')
}

const toPayload = (data: Page): PayloadAction<{ page: number; pageSize: number; sort: string; direction: string }> => {
  return { payload: { page: data.page, pageSize: data.pageSize, sort: data.sort, direction: data.direction }, type: '' }
}

export type UsersProps = Record<string, never>

export const Users: React.FC<UsersProps> = (/* props: UsersProps */) => {
  const getSearchParams = (): UsersSearchParams => {
    return {
      page: searchParams.has('page') ? parseInt(searchParams.get('page')!) : 0,
      size: searchParams.has('size') ? parseInt(searchParams.get('size')!) : 5,
      sort: searchParams.has('sort') ? searchParams.get('sort')! : '_id',
      desc: searchParams.has('desc') ? searchParams.get('desc')! === 'true' : false,
    }
  }

  const createSearchParams = (): UsersSearchParams => {
    return {
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort: sorting[0].id,
      desc: sorting[0].desc,
    }
  }
  const [searchParams, setSearchParams] = useSearchParams()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: getSearchParams().page,
    pageSize: getSearchParams().size,
  })
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: getSearchParams().sort,
      desc: getSearchParams().desc,
    },
  ])

  const { roles } = useRolesGraphql()
  const users = usersApi.useGetAllUsersQuery(toPayload(buildPage(pagination, sorting)))
  const size = usersApi.useGetUsersSizeQuery()
  const [createUser] = usersApi.useCreateUserMutation()
  const { t } = useTranslation(['main'])
  const columns = useUserColumns()

  useEffect(() => {
    const params = getSearchParams()
    setPagination({ pageIndex: params.page, pageSize: params.size })
    setSorting([{ id: params.sort, desc: params.desc }])
  }, [searchParams])

  useEffect(() => {
    const params = createSearchParams()
    setSearchParams(
      (prevParams) => {
        return new URLSearchParams({
          ...Object.fromEntries(prevParams.entries()),
          ...toString(params),
        })
      },
      { replace: true }
    )
  }, [pagination, sorting])

  const { connectionStatus, lastMessage } = useSimpleSSE(import.meta.env.VITE_APP_BACKEND_URL + '/update/user', {
    onUpdate: (message) => {
      console.log('User update received:', message)
      console.log('Refetching users...')
      users.refetch()
    },
    onConnect: () => {
      console.log('Connected to SSE stream')
    },
    onError: (error) => {
      console.error('SSE error:', error)
    },
  })

  if (users.isLoading) {
    return <LoadingScreenMemo />
  }

  if (users.isError) {
    return (
      <>
        {/* todo: refactor by creating a custom control component */}
        <div className="sse-bar">
          <span className={`status ${connectionStatus}`}>Status: {connectionStatus} </span>
          {lastMessage && <span>Last update: {lastMessage.content}</span>}
        </div>
        <div>Error</div>
      </>
    )
  }

  return (
    <>
      {/* todo: refactor by creating a custom control component */}
      <div className="sse-bar">
        <span className={`status ${connectionStatus}`}>Status: {connectionStatus} </span>
        {lastMessage && <span>Last update: {lastMessage.content}</span>}
      </div>

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
