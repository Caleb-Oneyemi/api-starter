import config from 'config'
import { FileTypes } from '../../../common'
import storageClient from '../../../storageClient'

const bucketName: string = config.get('doPhotoBucketName')

export const getPhotoUploadUrl = async (publicId: string) => {
  return storageClient.getSignedUrl({
    key: publicId,
    bucketName: bucketName,
    expires: 60 * 60,
    fileType: FileTypes.PROFILE_PHOTO,
    isPublic: true,
  })
}
