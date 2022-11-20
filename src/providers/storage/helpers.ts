import { S3Client } from '@aws-sdk/client-s3'
import { FileTypes } from '../../common'
import { FileType, InitClientParams } from './types'

const getCredentials = (type: FileType, params: InitClientParams) => {
  switch (type) {
    case FileTypes.PROFILE_PHOTO:
      return {
        region: params.region,
        endpoint: params.endpoint,
        forcePathStyle: false,
        credentials: {
          accessKeyId: params.photoBucketAccessKey,
          secretAccessKey: params.photoBucketSecretAccessKey,
        },
      }

    default:
      throw new Error(`Unknown FileType: ${type} for DO credentials`)
  }
}

export const getClient = (type: FileType, params: InitClientParams) => {
  const credentials = getCredentials(type, params)
  return new S3Client(credentials)
}
