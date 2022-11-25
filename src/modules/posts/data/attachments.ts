import { Attachment } from '../models'
import { AttachmentAttributes } from '../types/attachments'

export const createAttachment = (input: AttachmentAttributes) => {
  return Attachment.build(input)
}

export const getAttachmentByPublicId = async (publicId: string) => {
  return Attachment.findOne({ publicId })
}

export const updateAttachment = async (publicId: string, url: string) => {
  return Attachment.findOneAndUpdate(
    { publicId },
    { $set: { url } },
    { new: true },
  )
}
export const deleteAttachment = async (publicId: string) => {
  return Attachment.findOneAndDelete({ publicId })
}
