import fs from 'fs/promises'
import mustache from 'mustache'
import { logger } from '../../common'

interface TemplateInput {
  greetingText: string
  body: string
  url: string
  buttonText: string
}

const defaultHtml = `
  <html>
    <h1>{{greetingText}},</h1>
    <p>{{body}}</p>
    <button><a href={{url}}>{{buttonText}}</a></button>
  </html>
`

const getMainTemplate = async (): Promise<string> => {
  try {
    const html = await fs.readFile('src/providers/mail/templates/main.html')
    return html.toString()
  } catch (err) {
    logger.warn(
      `Error reading main email html template --- ${JSON.stringify(err)}`,
    )

    return defaultHtml
  }
}

export const renderTemplate = async (input: TemplateInput) => {
  const template = await getMainTemplate()
  const html = mustache.render(template, input)
  return html
}
