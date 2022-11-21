import config from 'config'
import { StorageClient } from './providers/storage'

export default new StorageClient({
  region: config.get('digitalOcean.region'),
  endpoint: config.get('digitalOcean.spacesEndpoint'),
  photoBucketAccessKey: config.get('digitalOcean.photoBucketAccessKey'),
  photoBucketSecretAccessKey: config.get(
    'digitalOcean.photoBucketSecretAccessKey',
  ),
})
