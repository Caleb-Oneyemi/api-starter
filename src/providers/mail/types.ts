export type MailType = 'register'

export interface MailInput {
  to: string
  subject: string
  html: string
}

export interface RegistrationMailInput {
  firstName: string
  email: string
}
