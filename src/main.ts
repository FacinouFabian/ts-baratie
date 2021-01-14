import readline from 'readline'
import { createReadStream } from 'fs'
import { join } from 'path'
import Grid from './core/Grid'
import Game from './core/Game'
import Player from './core/Player'
import { Point } from '../types'

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

      gridMap = new Grid({ width: parseInt(width), height: parseInt(height) })
      gridMap.initialize()
    }
  } else {
    line.split('').forEach(char => {
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
  // save the map to the game
  game.setMap(gridMap)
  // display the map
  game.map?.displayMap()
  // change player turn
  game.setLastTurnWas(game.players[1])
  // delete an ailumette from player 2
  game.players[1].deleteAilumettes(1, 1)
  // check if the ailumette has been deleted
  console.log('Node:', game.map?.getNodeAt({ x: 6, y: 1 }))
})
