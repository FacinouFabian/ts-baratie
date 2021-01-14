import { Point, Data } from '../../types'
import Node from './Node'

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

  public displayMap(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const nodeValue = this.nodes[y][x].value != undefined ? this.nodes[y][x].value : ' '
        process.stdout.write(nodeValue)
      }
      process.stdout.write('\n')
    }
  }

  public getNodeAt({ x, y }: Point): Node {
    return this.nodes[y][x]
  }

  // return all aillumettes of a line
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

  // return a certain number of Nodes from an array of Nodes
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
}
