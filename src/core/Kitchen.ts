import chalk from 'chalk'
import cluster from 'cluster'

import Cook from './Cook'

export default class Kitchen {
  id: string
  nbCookers: number
  cooks: Cook[]

  constructor(id: string, nbCookers: number) {
    this.id = id
    this.nbCookers = nbCookers
    this.cooks = []
  }

  init(): void {
    console.log(chalk.bold.blue(`[Reception] -->> opened kitchen ${this.id}`))
    for (let i = 0; i < this.nbCookers; i++) {
      const newCook = new Cook((i + 1).toString(), this.id)
      this.cooks.push(newCook)
    }

    this.cooks.map(cook => cook.init())
  }

  sendStatus(): void {
    const worker = cluster.workers[this.id]
    if (worker) {
      worker.send({ status: 'ORDER READY' })
    }
  }
}
