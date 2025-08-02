export async function sleep(ms = 1000): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}
