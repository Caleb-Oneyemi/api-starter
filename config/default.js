require('dotenv').config()

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  frontendAppUrl: process.env.FRONTEND_APP_URL,
  newRelic: {
    licenseKey: process.env.NEWRELIC_LICENSE_KEY,
  },
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    sender: process.env.SENDGRID_SENDER,
  },
  digitalOcean: {
    region: process.env.DO_REGION,
    spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
    photoBucketName: process.env.DO_PHOTO_BUCKET_NAME,
    photoBucketAccessKey: process.env.DO_PHOTO_BUCKET_ACCESS_KEY,
    photoBucketSecretAccessKey: process.env.DO_PHOTO_BUCKET_SECRET_ACCESS_KEY,
    postAttachmentBucketName: process.env.DO_POST_ATTACHMENT_BUCKET_NAME,
    postAttachmentBucketAccessKey:
      process.env.DO_POST_ATTACHMENT_BUCKET_ACCESS_KEY,
    postAttachmentBucketSecretAccessKey:
      process.env.DO_POST_ATTACHMENT_BUCKET_SECRET_ACCESS_KEY,
  },
}
