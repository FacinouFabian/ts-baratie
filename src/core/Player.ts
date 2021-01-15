interface PlayerInfo {
  name: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  delete: Function
}

export default class Player {
  readonly name: string
  readonly ready: boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  private action: Function

  constructor(data: PlayerInfo) {
    this.name = data.name
    this.ready = false
    this.action = data.delete
  }

  /**
   * @name deleteAilumettes
   * @description allows the player to delete an ailumette
   * @param line the line
   * @param nb the match
   * @return {boolean}
   */
  public deleteAilumettes(line: number, nb: number): boolean {
    return this.action(line, nb)
  }
}
