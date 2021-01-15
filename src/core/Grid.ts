import { Point, Data } from '../../types'
import Node from './Node'
import randomNb from '../helpers/randomNumber'
import { resolve } from 'path'

interface Parameters {
  width: number
  height: number
}

export default class Grid {
  public width: number
  public height: number

  // Nodes Grid
  private nodes: Node[][] = []

  constructor({ height, width }: Parameters) {
    this.height = height
    this.width = width
  }

  /**
   * @name initialize
   * @description init the map
   * @return {void}
   */
  public initialize(): void {
    for (let y = 0; y < this.height; y++) {
      this.nodes[y] = []
      for (let x = 0; x < this.width; x++) {
        this.nodes[y][x] = new Node({
          position: { x, y },
          value: '',
        })
      }
    }
  }

  /**
   * @name displayMap
   * @description displays the map
   * @return {void}
   */
  public displayMap(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const nodeValue = this.nodes[y][x].value != undefined ? this.nodes[y][x].value : ' '
        process.stdout.write(nodeValue)
      }
      process.stdout.write('\n')
    }
  }

  /**
   * @name getNodeAt
   * @description displays the map
   * @param position the x position and y position of the point
   * @return {Node}
   */
  public getNodeAt(position: Point): Node {
    const { x, y } = position
    return this.nodes[y][x]
  }

  /**
   * @name getNodesFromLine
   * @description return all aillumettes of a line
   * @param line the line
   * @return {Promise<Node[] | string>}
   */
  public getNodesFromLine(line: number): Promise<Node[] | string> {
    return new Promise((resolve, reject) => {
      if (line > this.height) {
        reject('This line is out of range')
      } else {
        const lineNodes: Node[] = []
        for (let x = 0; x < this.width; x++) {
          if (this.nodes[line][x].value == '|') {
            const nodeValue = this.nodes[line][x]
            lineNodes.push(nodeValue)
          }
        }

        if (lineNodes.length != 0) resolve(lineNodes)
        else reject('There is no ailumettes on this line')
      }
    })
  }

  /**
   * @name getNodesFromLine
   * @description return a certain number of Nodes from an array of Nodes
   * @param lineNumber the line
   * @param nb the matches
   * @return {Promise<Data | string>}
   */
  public getLineNodes(lineNumber: number, nb: number): Promise<Data | string> {
    return new Promise(async (resolve, reject) => {
      this.getNodesFromLine(lineNumber)
        .then(line => {
          if (nb > line.length) {
            reject('The number of ailumettes to delete is out of range')
          }

          if (nb == 0) reject('Please, delete at least one ailumette.')

          if (typeof line != 'string') {
            const action = { line: lineNumber, amount: nb }
            resolve({ nodes: line.splice(0, nb), action })
          }
        })
        .catch(err => reject(err))
    })
  }

  public getRandomLine(): number {
    return randomNb(1, this.height - 1)
  }

  /**
   * @name testNodesAt
   * @description test if a node exists on a line
   * @param line the line
   * @param nb the match
   * @return {Promise<boolean>}
   */
  public testNodesAt(line: number, nb: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.getLineNodes(line, nb)
        .then(() => resolve(true))
        .catch(() => reject(false))
    })
  }
}
