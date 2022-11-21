import config from 'config'
import * as UserDAL from '../data'
import { AppUserAttributes, FileTypes } from '../../../common'
import storageClient from '../../../storageClient'

const bucketName: string = config.get('digitalOcean.photoBucketName')
const region: string = config.get('digitalOcean.region')

export const getPhotoUploadUrl = async (publicId: string) => {
  return storageClient.getSignedUrl({
    key: publicId,
    bucketName: bucketName,
    expires: 60 * 60,
    fileType: FileTypes.PROFILE_PHOTO,
    isPublic: true,
  })
}

export const updatePhoto = async (user: AppUserAttributes) => {
  if (!user.photoUrl) {
    const photoUrl = `https://${bucketName}.${region}.digitaloceanspaces.com/${user.publicId}`
    return UserDAL.updateAppUser({ publicId: user.publicId }, { photoUrl })
  }
}

export const deletePhoto = async (publicId: string) => {
  await storageClient.removeFile({
    key: publicId,
    bucketName: bucketName,
    fileType: FileTypes.PROFILE_PHOTO,
  })
  return UserDAL.updateAppUser({ publicId }, { photoUrl: null })
}
