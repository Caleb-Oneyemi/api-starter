import fs from 'fs/promises'
import { NotFoundError } from '../../common'
import { MailType } from './types'

export const getTemplate = async (type: MailType): Promise<string> => {
  let html

  switch (type) {
    case 'register':
      html = await fs.readFile('src/providers/mail/templates/welcomeEmail.html')
      break
    default:
      throw new NotFoundError(`mail template not found for type ${type}`)
  }

  return html.toString()
}
