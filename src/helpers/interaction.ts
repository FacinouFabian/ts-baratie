import { Response } from '../../definitions'
import askUser from './questions'

/**
 * @name interactWithUser
 * @description return the user's response after the questions
 * @return {Promise<Response>}
 */
const interactWithUser = (): Promise<Response> => {
  const ask: Promise<Response> = askUser()

  return new Promise((resolve, reject) => {
    ask.then((response: Response) => resolve(response)).catch(err => reject(err))
  })
}

export default interactWithUser
