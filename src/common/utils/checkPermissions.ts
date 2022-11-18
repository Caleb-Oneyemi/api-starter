import { NotAuthorizedError, NotFoundError } from '../errors'
import { UserAttributes } from '../types'

interface PermissionCheckInput<T> {
  userId: string
  recordId: string
  getRecord: (recordId: string, populate?: boolean) => Promise<T | null>
}

interface ResourceRecord {
  owner: string | UserAttributes
}

export async function checkPermissions<U extends ResourceRecord>({
  userId,
  recordId,
  getRecord,
}: PermissionCheckInput<U>) {
  const record = await getRecord(recordId)
  if (!record) {
    throw new NotFoundError('record does not exist')
  }

  if (record.owner.toString() !== userId) {
    throw new NotAuthorizedError('permission denied')
  }
}
