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
    process.on('message', message => {
      if (message.cook == this.id) {
        console.log(chalk.yellow(`[KITCHEN -->> ${this.id}] Message from reception`))
        console.log(chalk.green(`I received message: ${message.content}`))
        if (process.send) {
          process.send({ content: 'Thanks' })
        }
      }
    })
  }

  sendStatus(): void {
    if (process.send) {
      process.send({ content: 'Hello' })
    }
  }
}
