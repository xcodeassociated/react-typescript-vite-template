import { useEffect, useState } from 'react'
import { Role } from '../api/usersApi.types'
import { graphql } from '@/graphql/generated/'
import { useQuery } from '@apollo/client/react'

export const useRolesGraphql = () => {
  const [roles, setRoles] = useState<Role[]>()

  const GetAllPermissionsDocument = graphql(`
    query GetAllPermissions($page: Int, $size: Int, $sort: String, $direction: String) {
      getAllPermissions(page: $page, size: $size, sort: $sort, direction: $direction) {
        id
        name
      }
    }
  `)

  // note: after the query or mutation is written in the .ts/.tsx file, execute: bun run graphql-codegen --config codegen.ts --verbose

  const { loading, error, data } = useQuery(GetAllPermissionsDocument, {
    variables: {
      page: 0,
      size: 10,
      sort: 'id',
      direction: 'ASC',
    },
  })

  const getRoles = () => {
    const permissions: Role[] | undefined = data?.getAllPermissions?.map((e) => {
      return {
        _id: e?.id,
        name: e?.name,
      } as Role
    })
    setRoles([...permissions!])
  }

  useEffect(() => {
    if (!roles && !loading && !error && data) {
      getRoles()
    }

    return () => {
      setRoles(undefined)
    }
  }, [data, loading, error])

  return {
    roles,
    loading,
    error,
  }
}
