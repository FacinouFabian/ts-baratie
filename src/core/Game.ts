import { GameParameters, GameInfo, Data } from '../../types'
import Grid from './Grid'
import Player from './Player'

export default class Game {
  readonly players: Player[]
  private started: boolean
  private ended: boolean
  public map: Grid | null
  public lastTurnWas: Partial<Player>

  constructor({ players }: GameParameters) {
    this.players = players
    this.started = false
    this.ended = false
    this.map = null
    this.lastTurnWas = { name: '' }
  }

  public startGame(): void {
    this.started = true
  }

  public endGame(): void {
    this.ended = true
  }

  public getGameInfos(): GameInfo {
    return {
      players: this.players,
      started: this.started,
      ended: this.ended,
      lastTurnWas: this.lastTurnWas,
    }
  }

  public setLastTurnWas(player: Player): void {
    this.lastTurnWas = player
  }

  public setMap(map: Grid): void {
    this.map = map
  }

  public nextTurn(): Player | undefined {
    const result: Player | undefined = this.players.find(player => {
      return player.name != this.lastTurnWas.name
    })

    return result != undefined ? result : undefined
  }

  public async deleteAilumettes(line: number, nb: number): Promise<void> {
    await this.map
      ?.getLineNodes(line, nb)
      .then(data => {
        const { nodes, action } = data as Data
        nodes.map(node => node.clearValue())
        return action
      })
      .then(action => {
        console.log(`${this.lastTurnWas.name} removed ${action.amount} match(es) from line ${action.line}`)
        this.map?.displayMap()
      })
      .catch(err => {
        console.log(err)
      })
  }
}
