import type { User } from '@/payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: User | null): boolean => {
  console.log('CHECK ROLE DEBUG:')
  console.log('User:', user)
  console.log('User roles:', user?.roles)
  console.log('Required:', allRoles)

  if (user && allRoles) {
    return allRoles.some((role) => {
      return user?.roles?.some((individualRole) => {
        return individualRole === role
      })
    })
  }

  return false
}
