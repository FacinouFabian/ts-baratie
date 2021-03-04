import chalk from 'chalk'

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
    console.log('some status')
    /* if (process.send) {
      process.send({ content: 'Hello' })
    } */
  }
}
