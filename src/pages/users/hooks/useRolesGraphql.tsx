import { useEffect, useState, useCallback } from 'react'

import { Role } from '../api/usersApi.types'
import { useGetAllPermissionsQuery } from '@/graphql/generated'

export const useRolesGraphql = () => {
  const [roles, setRoles] = useState<Role[]>()
  const { loading, error, data } = useGetAllPermissionsQuery({
    variables: {
      page: 0,
      size: 10,
      sort: 'id',
      direction: 'ASC',
    },
  })

  const getRoles = useCallback(() => {
    const permissions =
      data?.getAllPermissions?.map(
        (e: Role) =>
          ({
            _id: e?._id,
            name: e?.name,
          }) as Role
      ) ?? []
    setRoles(permissions)
  }, [data])

  useEffect(() => {
    if (!roles && !loading && !error && data) {
      getRoles()
    }
    return () => {
      setRoles(undefined)
    }
  }, [roles, loading, error, data, getRoles])

  return {
    roles,
    loading,
    error,
  }
}
