import Game from '../core/Game'
import randomNb from './randomNumber'

/**
 * @name testValue
 * @description tests if the provided number of matches is not out of a line's ailumettes range
 * @param game the current game
 * @param line the line
 * @param matches the number of matches we want
 * @return {Promise<boolean>}
 */
const testValue = async (game: Game, line: number, matches: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    if (line) {
      await game.map
        ?.getLineNodes(line, matches)
        .then(() => resolve(true))
        .catch(() => {
          reject(false)
        })
    }
  })
}

/**
 * @name AIResponseTest
 * @description test if the AI can use the nb as response during its turn
 * @param game the current game
 * @return {Promise<number>}
 */
const AIResponseTest = async (game: Game): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const nb = randomNb(1, 3)

    testValue(game, 1, nb)
      .then(() => {
        resolve(nb)
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(() => AIResponseTest(game))
  })
}

export default AIResponseTest
