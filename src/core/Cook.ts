import cluster from 'cluster'

export default class Cook {
  cookId: string
  kitchen: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[]

  constructor(id: string, kitchen: string) {
    this.cookId = id
    this.kitchen = kitchen
    this.orders = []
  }

  init(): void {
    console.log(`[Kitchen ${this.kitchen}] -->> cook ${this.cookId} available.`)
  }

  sendStatus(): void {
    const worker = cluster.workers[this.kitchen]
    if (worker) {
      worker.send({ status: 'ORDER READY' })
    }
  }
}
