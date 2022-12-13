export default async function (): Promise<void> {
  await global.mongoServer.stop()
}
