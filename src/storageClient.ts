import config from 'config'
import { StorageClient } from './providers/storage'

export default new StorageClient({
  region: config.get('doRegion'),
  endpoint: config.get('doSpacesEndpoint'),
  photoBucketAccessKey: config.get('doPhotoBucketAccessKey'),
  photoBucketSecretAccessKey: config.get('doPhotoBucketSecretAccessKey'),
})
