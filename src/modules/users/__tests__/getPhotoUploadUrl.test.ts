import config from 'config'
import supertest from 'supertest'
import { app } from '../../../app'
import { FileTypes } from '../../../common'
import { StorageClient } from '../../../providers/storage'
import { publicId, token } from '../../../test/helpers'

const request = supertest(app)
const bucketName: string = config.get('digitalOcean.photoBucketName')

const url = 'https://testuploadurl.co/'
const storageClientMock = jest
  .spyOn(StorageClient.prototype, 'getPresignedPostUrl')
  .mockImplementation(() => {
    return Promise.resolve({ url, fields: {} })
  })

describe('Get Photo Upload Url Test', () => {
  test('Getting photo upload url fails if not authenticated', async () => {
    const result = await request.get('/api/users/photo/upload-url').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Not Authenticated' }],
      isSuccess: false,
    })
  })

  test('Getting photo upload url succeeds if authenticated', async () => {
    const result = await request
      .get('/api/users/photo/upload-url')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({ url: url + bucketName }),
      isSuccess: true,
    })
    expect(storageClientMock).toHaveBeenCalledTimes(1)
    expect(storageClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        key: publicId,
        bucketName,
        expires: 60 * 5,
        fileType: FileTypes.PROFILE_PHOTO,
        isPublic: true,
        sizeLimit: 5 * 10 ** 6,
      }),
    )
  })
})
