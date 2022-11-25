import { Attachment } from '../models'
import { AttachmentAttributes } from '../types/attachments'

export const createAttachment = (input: AttachmentAttributes) => {
  return Attachment.build(input)
}
