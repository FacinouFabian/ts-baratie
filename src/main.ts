import readline from 'readline'
import { createReadStream } from 'fs'
import { join } from 'path'
import Grid from './core/Grid'

const map = 'ailumette.01.map'
const mapPath = join('data', 'maps', map)

// check .map file extension

const rl = readline.createInterface({
  input: createReadStream(mapPath),
})

let gridMap: Grid

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

rl.on('close', () => {
  gridMap.displayMap()
  // get an ailumette and skip turn to the AI
  gridMap.getNodeAt({ x: 5, y: 2 }).clearValue()
})
