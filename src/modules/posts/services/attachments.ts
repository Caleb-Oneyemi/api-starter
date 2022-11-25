import config from 'config'
import { AttachmentAttributes } from '../types'
import * as DAL from '../data/attachments'
import storageClient from '../../../storageClient'
import { FileTypes, generatePublicId } from '../../../common'

const bucketName: string = config.get('digitalOcean.postAttachmentBucketName')

export const createAttachment = async (
  input: Pick<AttachmentAttributes, 'owner' | 'postId'>,
) => {
  const publicId = await generatePublicId()
  const attachment = await DAL.createAttachment({ publicId, ...input })

  const { url, fields } = await storageClient.getPresignedPostUrl({
    key: publicId,
    bucketName,
    expires: 60 * 30,
    fileType: FileTypes.POST_ATTACHMENT,
    isPublic: true,
  })

  return {
    attachment,
    url: url + bucketName,
    fields,
  }
}
