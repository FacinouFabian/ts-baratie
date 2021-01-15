import { GameParameters, GameInfo, Data } from '../../types'
import Grid from './Grid'
import Player from './Player'

export default class Game {
  readonly players: Player[]
  private started: boolean
  private ended: boolean
  private currentPlayer: string
  public map: Grid | null
  public lastTurnWas: string

  constructor({ players }: GameParameters) {
    this.players = players
    this.started = false
    this.ended = false
    this.map = null
    this.lastTurnWas = ''
    this.currentPlayer = ''
  }

  public startGame(): void {
    this.started = true
  }

  public endGame(): void {
    this.ended = true
  }

  public setCurrentPlayer(name: string): void {
    this.currentPlayer = name
  }

  public getGameInfos(): GameInfo {
    return {
      players: this.players,
      started: this.started,
      ended: this.ended,
      lastTurnWas: this.lastTurnWas,
    }
  }

  public setLastTurnWas(player: string): void {
    this.lastTurnWas = player
  }

  public setMap(map: Grid): void {
    this.map = map
  }

  public nextTurn(): Player | undefined {
    const result: Player | undefined = this.players.find(player => {
      return player.name != this.lastTurnWas
    })

    return result != undefined ? result : undefined
  }

  /**
   * @name deleteAilumettes
   * @description allows to delete ailumettes
   * @param line the line
   * @param nb the matches
   * @return {Promise<void>}
   */
  public async deleteAilumettes(line: number, nb: number): Promise<void> {
    await this.map
      ?.getLineNodes(line, nb)
      .then(data => {
        const { nodes, action } = data as Data
        nodes.map(node => node.clearValue())
        return action
      })
      .then(action => {
        console.log(`${this.currentPlayer} removed ${action.amount} match(es) from line ${action.line}`)
        this.map?.displayMap()
      })
      .catch(err => {
        console.log(err)
      })
  }
}
