/* eslint-disable @typescript-eslint/ban-types */
import chalk from 'chalk'

import { Status } from '../../definitions'
import Kitchen from './Kitchen'

type Message = {
  kitchenId: string
  content: string
}

export default class Reception {
  kitchens: Kitchen[]
  send: Function

  constructor(kitchens: Kitchen[], send: Function) {
    this.kitchens = kitchens
    this.send = send
  }

  init(): void {
    console.log(chalk.magenta(`The baratie have ${this.kitchens.length} kitchens availables!`))
  }

  sendToKitchen(message: Message): void {
    this.send(message)
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
