import config from 'config'
import sgMail from '@sendgrid/mail'
import mustache from 'mustache'
import { getTemplate } from './getTemplate'
import { MailInput, RegistrationMailInput } from './types'

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

export const sendRegistrationMail = async (
  { firstName, email }: RegistrationMailInput,
  token: string,
) => {
  const subject = 'Welcome to the App! Verify Your Email'
  const template = await getTemplate('register')
  const url = `${config.get('appUrl')}/verify/${token}`

  const html = mustache.render(template, { firstName, url })
  await sendMail({ to: email, subject, html })
}
