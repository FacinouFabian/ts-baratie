interface NodeParameters {
  position: Point
  isWalkable?: boolean
  value: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function
}

export default class Node {
  readonly position: Point
  public value: string
  private isWalkable: boolean
  private callback

  constructor({ position, isWalkable, value, callback }: NodeParameters) {
    this.position = position
    this.isWalkable = isWalkable || true
    this.value = value
    this.callback = callback
  }

  public getIsWalkable(): boolean {
    return this.isWalkable
  }

  public getValue(): string {
    return this.value
  }

  public setIsWalkable(isWalkable: boolean): void {
    this.isWalkable = isWalkable
  }

  public setValue(value: string): void {
    this.value = value
  }

  public clearValue(): void {
    this.value = ' '
    this.callback()
  }
}
