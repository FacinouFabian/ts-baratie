import Node from './src/core/Node'
import Player from './src/core/Player'

export enum Status {
  COOKSBUSY = 'COOKS BUSY',
  MISSINGINGREDIENTS = 'MISSING INGREDIENTS',
  ORDERREADY = 'ORDER READY',
}

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
  lastTurnWas: string
}

interface DeleteAction {
  line: number
  amount: number
}

interface Data {
  nodes: Node[]
  action: DeleteAction
}

interface Response {
  username?: string
  line: string
  matches: string
}
