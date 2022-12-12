export default async function (): Promise<void> {
  await globalThis.mongoServer.stop()
}
