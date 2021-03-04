import chalk from 'chalk'
import cluster from 'cluster'

export default class Kitchen {
  id: string
  nbCookers: number
  cookers: Array<string>

  constructor(id: string, nbCookers: number) {
    this.id = id
    this.nbCookers = nbCookers
    this.cookers = []
  }

  init(): void {
    console.log(chalk.blue(`[Kitchen] opened kitchen -->> ${this.id}`))
  }

  sendStatus(): void {
    const worker = cluster.workers[this.id]
    if (worker) {
      worker.send({ status: 'ORDER READY' })
    }
  }
}
