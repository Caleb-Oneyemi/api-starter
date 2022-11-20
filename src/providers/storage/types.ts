import { FileTypes } from '../../common'

export type FileType = keyof typeof FileTypes

export interface InitClientParams {
  region: string
  endpoint: string
  photoBucketAccessKey: string
  photoBucketSecretAccessKey: string
}

export interface ClientMethodInput {
  key: string
  bucketName: string
  expires: number
  fileType: FileType
}
