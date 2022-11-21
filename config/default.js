/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

module.exports = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridSender: process.env.SENDGRID_SENDER,
  appUrl: process.env.APP_URL,
  redisUrl: process.env.REDIS_URL,
  doRegion: process.env.DO_REGION,
  doSpacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  doPhotoBucketName: process.env.DO_PHOTO_BUCKET_NAME,
  doPhotoBucketAccessKey: process.env.DO_PHOTO_BUCKET_ACCESS_KEY,
  doPhotoBucketSecretAccessKey: process.env.DO_PHOTO_BUCKET_SECRET_ACCESS_KEY,
}
