import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getClient } from './helpers'
import { ClientMethodInput, InitClientParams } from './types'

export class StorageClient {
  constructor(private params: InitClientParams) {
    this.params = params
  }

  async getSignedUrl({
    key,
    bucketName,
    expires,
    fileType,
  }: ClientMethodInput) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    return getSignedUrl(getClient(fileType, this.params), command, {
      expiresIn: expires,
    })
  }

  removeFile({
    key,
    bucketName,
    fileType,
  }: Omit<ClientMethodInput, 'expires'>) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    return getClient(fileType, this.params).send(command)
  }
}
