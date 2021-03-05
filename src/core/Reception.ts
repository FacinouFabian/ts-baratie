/* eslint-disable @typescript-eslint/ban-types */
import chalk from 'chalk'

import { Status } from '../../definitions'
import Kitchen from './Kitchen'

type Message = {
  type: 'INFORMATION' | 'STATUS'
  kitchenId?: string
  content?: string
  status?: string
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

  openKitchen(kitchenId: string): void {
    const kitchen = this.kitchens.find(item => item.id == kitchenId)
    if (kitchen) {
      kitchen.init()
    }
  }

  closeKitchen(kitchenId: string): void {
    const kitchen = this.kitchens.find(item => item.id == kitchenId)
    kitchen?.sayInactive()
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

  // send kitchens status
  status(): void {
    this.kitchens.map(kitchen => {
      console.log(chalk.blue(`[Kitchen] ${kitchen.id} -->> ${JSON.stringify(kitchen)}`))
    })
  }
}
