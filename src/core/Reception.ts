/* eslint-disable @typescript-eslint/ban-types */
import chalk from 'chalk'
import inquirer from 'inquirer'
import _, { isEmpty } from 'lodash'

import { Status } from '../../definitions'
import Kitchen from './Kitchen'

type Message = {
  type: 'INFORMATION' | 'STATUS'
  kitchenId?: string
  content?: string
  status?: string
}

type Answer = {
  order: string
}

type Dish = {
  dish: string
  size: string
  number: number
}

export default class Reception {
  kitchens: Kitchen[]
  send: Function
  openHandler: Function
  cookingTime: number
  cooksPerKitchen: number
  regenerateIngredientsTime: number
  private dishOrderQuestion = [{
    type: 'input',
    name: 'order',
    message: 'Enter dish order:'
  }]

  constructor(parameters: number[]) {
    [this.cookingTime, this.cooksPerKitchen, this.regenerateIngredientsTime] = parameters
    this.kitchens = []
    this.send = () => null
    this.openHandler = () => null
  }

  async init(): Promise<void> {
    console.log(chalk.magenta(`The baratie have ${this.kitchens.length} kitchens availables!`))
    await this.allowDishOrder()
  }

  async allowDishOrder(): Promise<void> {
    const dishes: Dish[] = await this.setDishOrder()
    console.log(dishes)
    //repartitions commandes
  }

  async setDishOrder(): Promise<Dish[]> {
    let dishes: string[] = []

    while (isEmpty(dishes)) {
      console.log('Dish order syntax example: Takoyaki M x2; Udon XL x1; MatchaCookie S x1')
      const answer: Answer = await inquirer.prompt(this.dishOrderQuestion)
      dishes = this.separateDishOrder(answer.order)
    }
    return this.convertDishes(dishes)
  }

  separateDishOrder(dishOrderEntry: string): string[] {
    const regex = /[a-zA-Z]+\s(S|M|L|XL|XXL)\sx[1-9][0-9]*/g;
    return dishOrderEntry.match(regex) || []
  }

  convertDishes(dishes: string[]): Dish[] {
    const convertedDishes: Dish[] = []
    _.each(dishes, (dish) => {
      convertedDishes.push({
        dish: dish.slice(0, dish.indexOf(' ')),
        size: dish.slice(dish.indexOf(' ') + 1, dish.lastIndexOf('x') - 1),
        number: Number(dish.slice(dish.lastIndexOf('x') + 1))
      })
    })

    return convertedDishes
  }

  distributeDishes() {
    //...
  }

  sendToKitchen(message: Message): void {
    this.send(message)
  }

  openKitchen(): void {
    this.openHandler()
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
