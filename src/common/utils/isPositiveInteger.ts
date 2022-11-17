export const isPositiveInteger = (input: string) => {
  if (!input) return false
  const num = Number(input)
  if (!Number.isInteger(num) || num < 1) return false
  return true
}
