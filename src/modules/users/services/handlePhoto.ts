import config from 'config'
import * as UserDAL from '../data'
import { AppUserAttributes, FileTypes } from '../../../common'
import storageClient from '../../../storageClient'

const bucketName: string = config.get('digitalOcean.photoBucketName')
const region: string = config.get('digitalOcean.region')

export const getPhotoUploadUrl = async (publicId: string) => {
  const fiveMb = 5 * 10 ** 6
  const fiveMinutes = 60 * 5

  const { url, fields } = await storageClient.getPresignedPostUrl({
    key: publicId,
    bucketName,
    expires: fiveMinutes,
    fileType: FileTypes.PROFILE_PHOTO,
    isPublic: true,
    sizeLimit: fiveMb,
  })

  return {
    url: url + bucketName,
    fields,
  }
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
