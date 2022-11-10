export type MailType = 'register' | 'emailChange'

export interface MailInput {
  to: string
  subject: string
  html: string
}

export interface NewMailInput {
  firstName: string
  email: string
}
