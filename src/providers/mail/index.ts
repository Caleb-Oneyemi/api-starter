import config from 'config'
import { sendMail } from './sendMail'
import { NewMailInput } from './types'
import { renderTemplate } from './handleTemplate'

export const sendRegistrationMail = async (
  { firstName, email }: NewMailInput,
  token: string,
) => {
  const subject = 'Welcome to the App! Verify Your Email'
  const url = `${config.get('frontendAppUrl')}/verify/${token}`

  const html = await renderTemplate({
    greetingText: `Hi ${firstName}, Welcome to the App`,
    body: 'Tap the button below to verify your email address',
    buttonText: 'Verify',
    url,
  })

  await sendMail({ to: email, subject, html })
}

export const sendEmailVerificationMail = async (
  { firstName, email }: NewMailInput,
  token: string,
) => {
  const subject = 'Welcome to the App! Verify Your Email'
  const url = `${config.get('frontendAppUrl')}/verify/${token}`

  const html = await renderTemplate({
    greetingText: `Hi ${firstName}`,
    body: 'We noticed you changed your email, please tap the button below to verify your new email address',
    buttonText: 'Verify',
    url,
  })

  await sendMail({ to: email, subject, html })
}

export const sendPasswordResetMail = async (
  { firstName, email }: NewMailInput,
  token: string,
) => {
  const subject = 'Password Reset'
  const url = `${config.get('frontendAppUrl')}/reset-password/${token}`

  const html = await renderTemplate({
    greetingText: `Hi ${firstName}`,
    body: 'Tap the button below to initiate password reset',
    buttonText: 'Reset',
    url,
  })

  await sendMail({ to: email, subject, html })
}
