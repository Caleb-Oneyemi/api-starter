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
