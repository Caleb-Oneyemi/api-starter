import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
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
    isPublic = false,
  }: ClientMethodInput) {
    const client = getClient(fileType, this.params)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ACL: isPublic ? 'public-read' : 'private',
    })

    return getSignedUrl(client, command, {
      expiresIn: expires,
    })
  }

  async getPresignedPostUrl({
    key,
    bucketName,
    expires,
    fileType,
    isPublic = false,
    sizeLimit,
  }: ClientMethodInput) {
    const client = getClient(fileType, this.params)
    const fiftyMb = 5 * 10 ** 7
    const limit = sizeLimit ? sizeLimit : fiftyMb

    return createPresignedPost(client, {
      Bucket: bucketName,
      Key: key,
      Conditions: [['content-length-range', 0, limit]],
      Fields: {
        acl: isPublic ? 'public-read' : 'private',
        'Content-Type': '*',
      },
      Expires: expires,
    })
  }

  removeFile({
    key,
    bucketName,
    fileType,
  }: Omit<ClientMethodInput, 'expires' | 'isPublic'>) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    return getClient(fileType, this.params).send(command)
  }
}
