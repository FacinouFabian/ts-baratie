import chalk from 'chalk'
import cluster from 'cluster'

import Cook from './Cook'

export default class Kitchen {
  id: string
  nbCookers: number
  cooks: Cook[]
  isInit: boolean

  constructor(id: string, nbCookers: number) {
    this.id = id
    this.nbCookers = nbCookers
    this.cooks = []
    this.isInit = false
  }

  init(): void {
    console.log(chalk.bold.blue(`[Reception] -->> opened kitchen ${this.id}`))
    // add cooks and initialize them
    for (let i = 0; i < this.nbCookers; i++) {
      const newCook = new Cook((i + 1).toString(), this.id)
      this.cooks.push(newCook)
    }

    this.cooks.map(cook => cook.init())

    this.isInit = true
  }

  sendStatus(status: string): void {
    const worker = cluster.workers[this.id]
    if (worker) {
      worker.send({ type: 'STATUS', status })
    }
  }

  // say the kitchen is inactive for closing
  sayInactive(): void {
    this.sendStatus('INACTIVE')
  }
}
