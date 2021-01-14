import Node from './Node'

interface Parameters {
  width: number
  height: number
}

export default class Grid {
  readonly width: number
  readonly height: number

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
          callback: () => this.nextTurn(),
        })
      }
    }
  }

  public nextTurn(): any {
    console.log('Player has modified grid')
    this.displayMap()
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

  public getNeighbours(node: Node): Node[] {
    const neighbours: Node[] = []
    const { x, y } = node.position

    // ↑
    if (this.isOnGrid({ y: y - 1, x })) {
      const topNode = this.getNodeAt({ y: y - 1, x })
      if (topNode && topNode.getIsWalkable()) {
        neighbours.push(topNode)
      }
    }

    // →
    if (this.isOnGrid({ y, x: x + 1 })) {
      const rightNode = this.getNodeAt({ y, x: x + 1 })
      if (rightNode && rightNode.getIsWalkable()) {
        neighbours.push(rightNode)
      }
    }

    // ↓
    if (this.isOnGrid({ y: y + 1, x })) {
      const bottomNode = this.getNodeAt({ y: y + 1, x })
      if (bottomNode && bottomNode.getIsWalkable()) {
        neighbours.push(bottomNode)
      }
    }

    // ←
    if (this.isOnGrid({ y, x: x - 1 })) {
      const leftNode = this.getNodeAt({ y, x: x - 1 })
      if (leftNode && leftNode.getIsWalkable()) {
        neighbours.push(leftNode)
      }
    }
    return neighbours
  }

  private isOnGrid({ x, y }: Point): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }
}
