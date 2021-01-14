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

  public deleteAilumettes(line: number, nb: number): boolean {
    return this.action(line, nb)
  }
}
