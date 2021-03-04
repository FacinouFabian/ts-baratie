import chalk from 'chalk'
import cluster from 'cluster'

import Kitchen from './Kitchen'

export default class Cook {
  id: string
  kitchen: Kitchen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orders: any[]

  constructor(id: string, kitchen: Kitchen) {
    this.id = id
    this.kitchen = kitchen
    this.orders = []
  }

  init(): void {
    console.log(`[Kitchen ${this.kitchen.id}] -->> cook ${this.id} available.`)
  }

  sendStatus(): void {
    const worker = cluster.workers[this.id]
    if (worker) {
      worker.send({ status: 'ORDER READY' })
    }
  }
}
