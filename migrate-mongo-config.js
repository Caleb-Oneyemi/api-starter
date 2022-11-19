//@ts-check
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @typedef { import("./migrate-mongo-config") } MigrationConfig
 */

const path = require('path')
const config = require('config')

const url = config.get('mongoUrl')

/** @type {MigrationConfig} */
const migrationConfig = {
  mongodb: {
    url,
  },
  migrationsDir: path.join(__dirname, 'migrations'),
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  moduleSystem: 'commonjs',
}

module.exports = migrationConfig
