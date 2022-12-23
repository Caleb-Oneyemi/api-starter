import { auth } from '../common'
import { getUserByPublicId } from './users/data'

export const isAuthenticated = auth(getUserByPublicId)
