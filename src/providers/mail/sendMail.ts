import config from 'config'
import sgMail from '@sendgrid/mail'
import { MailInput } from './types'

sgMail.setApiKey(config.get('sendgridApiKey'))

export const sendMail = async (input: MailInput) => {
  const { to, subject, html } = input

  const from: string = config.get('sendgridSender')

  const msg = {
    to,
    from,
    subject,
    html,
  }

  await sgMail.send(msg)
}
