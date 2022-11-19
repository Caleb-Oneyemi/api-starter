declare namespace MigrationConfig {
  const mongodb: {
    url: string
  }
  const migrationsDir: string
  const changelogCollectionName: string
  const migrationFileExtension: string
  const moduleSystem: string
}

export = MigrationConfig
