import Node from './src/core/Node'
import Player from './src/core/Player'

interface Point {
  x: number
  y: number
}

interface GameParameters {
  players: Player[]
}

interface GameInfo {
  players: Player[]
  started: boolean
  ended: boolean
  lastTurnWas: Partial<Player>
}

interface DeleteAction {
  line: number
  amount: number
}

interface Data {
  nodes: Node[]
  action: DeleteAction
}
