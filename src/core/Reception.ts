import cluster from 'cluster'
import chalk from 'chalk'
import { Status } from '../../definitions'
import Kitchen from './Kitchen'

export default class Reception {
  nbCPUs: number
  kitchens: Kitchen[]

  constructor(numberCPUS: number) {
    this.nbCPUs = numberCPUS
    this.kitchens = []
  }

  async init(): Promise<void> {
    if (cluster.isMaster) {
      console.log(chalk.magenta(`I have ${this.nbCPUs} CPUs availables`))

      const processesMap: { id: string; name: number }[] = []

      for (let i = 0; i < this.nbCPUs; i++) {
        const myId = (i + 1).toString().padStart(2, '0')
        const kitchen = cluster.fork({ kitchenId: myId })

        /* kitchen.send({ cook: 1, content: 'Tiens' }) */

        processesMap.push({ id: myId, name: kitchen.id })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kitchen.on('message', (message: { content: string }) => {
          const sender: { id: string; name: number }[] = processesMap.filter(item => item.name == kitchen.id)
          console.log(chalk.yellow(`[RECEPTION] Message from kitchen -->> ${sender[0].name}`))
          console.log(chalk.green(`I received message: ${message.content}`))
        })
      }
    } else {
      const kitchenItem = new Kitchen(process.env.kitchenId as string, 5)
      kitchenItem.init()
      this.kitchens.push(kitchenItem)
    }
  }

  sendToKitchen(): void {
    if (cluster.isMaster) {
      ;(cluster.worker as cluster.Worker).send({ cook: '01', content: 'h' })
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  onStatus(status: Status, callback: Function): void {
    switch (status) {
      case 'ORDER READY':
        callback()
        break
      case 'MISSING INGREDIENTS':
        callback()
        break
      case 'ORDER READY':
        callback()
        break
      default:
        callback()
        break
    }
  }

  status(): void {
    this.kitchens.map(kitchen => {
      console.log(chalk.blue(`[Kitchen] ${kitchen.id} -->> ${JSON.stringify(kitchen)}`))
    })
  }
}
