import inquirer from 'inquirer'
import { Response } from '../../definitions'

const questions = {
  prompt: () => {
    const questions = [
      /* {
        name: 'username',
        type: 'input',
        message: 'Enter your username (integers are not accepted):',
        validate: function (value: string) {
          if (value.length && typeof value == 'string') {
            return true
          } else {
            return 'Enter your username (integers are not accepted):'
          }
        },
      }, */
      {
        name: 'line',
        type: 'input',
        message: 'Line:',
        validate: function (value: string) {
          if (value) {
            return true
          } else {
            return 'Line:'
          }
        },
      },
      {
        name: 'matches',
        type: 'input',
        message: 'Matches:',
        validate: function (value: string) {
          if (value) {
            return true
          } else {
            return 'Matches:'
          }
        },
      },
    ]
    return inquirer.prompt(questions)
  },
}

/**
 * @name askUser
 * @description prompt a list of questions in the CLI
 * @return {Promise<Response>}
 */
const askUser = async (): Promise<Response> => {
  const results: Response = await questions.prompt()
  return results
}

export default askUser
