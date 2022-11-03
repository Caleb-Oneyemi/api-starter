import sgMail from '@sendgrid/mail'
import config from 'config'

sgMail.setApiKey(config.get('sendgridApiKey'))

interface MailInput {
  to: string
  subject: string
  html: string
}

const from: string = config.get('sendgridSender')

export const sendMail = async (input: MailInput) => {
  const { to, subject, html } = input
  const msg = {
    to,
    from,
    subject,
    html,
  }

  await sgMail.send(msg)
}
