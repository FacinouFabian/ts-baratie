import readline from 'readline'
import { createReadStream } from 'fs'
import { join } from 'path'
import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import Grid from './core/Grid'
import Game from './core/Game'
import Player from './core/Player'
import { Point } from '../types'
import AIResponseTest from './helpers/AIResponseTest'
import interactWithUsers from './helpers/interaction'

const map = 'ailumette.01.map'
const mapPath = join('data', 'maps', map)

// check .map file extension

const rl = readline.createInterface({
  input: createReadStream(mapPath),
})

let gridMap: Grid
const game: Game = new Game({
  players: [
    new Player({ name: 'Golden', delete: (line: number, nb: number) => game.deleteAilumettes(line, nb) }),
    new Player({ name: 'AI', delete: (line: number, nb: number) => game.deleteAilumettes(line, nb) }),
  ],
})

let rowCount = 0
let columnCount = 0

rl.on('line', line => {
  // Parse first line to retrieve width & height of map
  if (rowCount === 0) {
    const { groups } = line.match(/(?<width>\d+)x(?<height>\d+)/) || {}

    if (groups) {
      const { width, height } = groups
      // init map
      gridMap = new Grid({ width: parseInt(width), height: parseInt(height) })
      gridMap.initialize()
    }
  } else {
    line.split('').forEach(char => {
      // fill nodes
      const nodePosition: Point = { x: columnCount, y: rowCount - 1 }
      const node = gridMap.getNodeAt(nodePosition)

      if (node != undefined) {
        node.value = char
      }

      columnCount++
    })
  }

  rowCount++
  columnCount = 0
})

rl.on('close', async () => {
  clear()
  console.log(chalk.yellow(figlet.textSync('Ailumette', { horizontalLayout: 'fitted' })))
  console.log(chalk.red('Setting up the map...'))
  console.log(chalk.green('Map is ready.'))
  // save the map to the game
  game.setMap(gridMap)
  // display the map
  game.map?.displayMap()
  // start the game
  startGame(game)
})

/**
 * @name startGame
 * @description starts a game
 * @param game the current game
 * @return {void}
 */
const startGame = (game: Game): void => {
  game.startGame()
  console.log(chalk.blue('Your turn'))
  playerTurn(game)
}

/**
 * @name endGame
 * @description ends a game
 * @param game the current game
 * @return {void}
 */
const endGame = (game: Game): void => {
  game.endGame()
}

/**
 * @name playerTurn
 * @description allows the player to play during its turn
 * @param game the current game
 * @return {void}
 */
const playerTurn = (game: Game): void => {
  game.setCurrentPlayer(game.players[0].name)
  interactWithUsers().then(response => {
    const { line, matches } = response

    game.players[0].deleteAilumettes(parseInt(line), parseInt(matches))
  })
  // set player as last player who has play
  game.setLastTurnWas(game.players[0].name)
  // change turn
  AITurn(game)
}

/**
 * @name AITurn
 * @description allows the AI to play during its turn
 * @param game the current game
 * @return {Promise<void>}
 */
const AITurn = async (game: Game): Promise<void> => {
  // AI plays
  game.setCurrentPlayer(game.players[1].name)
  const line = game.map?.getRandomLine()
  if (line) {
    // test witch response the ai can use
    await AIResponseTest(game)
      .then(nb => {
        game.players[1].deleteAilumettes(line, nb)
      })
      .catch(() => console.log('There was an error when AI was trying to play.'))
    // set AI as last player who has play
    game.setLastTurnWas(game.players[1].name)
    // change turn
    playerTurn(game)
  }
}
