import { Point } from '../../types'

interface NodeParameters {
  position: Point
  isFilled?: boolean
  value: string
}

export default class Node {
  readonly position: Point
  public value: string
  private isFilled: boolean

  constructor({ position, isFilled, value }: NodeParameters) {
    this.position = position
    this.isFilled = isFilled || false
    this.value = value
  }

  public getIsFilled(): boolean {
    return this.isFilled
  }

  public getValue(): string {
    return this.value
  }

  public setIsFilled(isFilled: boolean): void {
    this.isFilled = isFilled
  }

  public setValue(value: string): void {
    this.value = value
  }

  public clearValue(): void {
    this.value = ' '
    this.isFilled = false
  }
}
