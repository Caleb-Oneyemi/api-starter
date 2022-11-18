import { Address6 } from 'ip-address'

export const normalizeIPAddress = (ip: string) => {
  if (Address6.isValid(ip)) {
    const address = new Address6(ip)
    return address.is4() ? address.parsedAddress4 : ip
  }

  return ip
}
