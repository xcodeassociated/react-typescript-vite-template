import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (!roles && !loading && !error && data) {
      getRoles()
    }

    return () => {
      setRoles(undefined)
    }
  }, [data, loading, error])

  const getRoles = () => {
    const permissions: Role[] | undefined = data?.getAllPermissions?.map((e) => {
      return {
        _id: e?.id,
        name: e?.name,
      } as Role
    })
    setRoles([...permissions!])
  }

  return {
    roles,
    loading,
    error,
  }
}
