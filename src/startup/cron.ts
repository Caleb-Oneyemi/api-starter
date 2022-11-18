import * as jobs from '../jobs'

Object.values(jobs).forEach((job) => job.start())
