import httpStatus from 'http-status'
import * as AttachmentService from '../services/attachments'
import {
  ControllerInput,
  controllerWrapper,
  ResponseData,
} from '../../../common'

export const createAttachment = controllerWrapper(
  httpStatus.CREATED,
  async ({
    params,
    user,
  }: ControllerInput<{}, { postId: string }>): Promise<ResponseData> => {
    const owner = user?.id as string
    return AttachmentService.createAttachment({
      owner,
      postId: params.postId,
    })
  },
)

export const updateAttachment = controllerWrapper(
  httpStatus.OK,
  async ({
    params,
  }: ControllerInput<{}, { publicId: string }>): Promise<ResponseData> => {
    return AttachmentService.updateAttachment(params.publicId)
  },
)

export const deleteAttachment = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({
    params,
  }: ControllerInput<{}, { publicId: string }>): Promise<ResponseData> => {
    return AttachmentService.deleteAttachment(params.publicId)
  },
)
