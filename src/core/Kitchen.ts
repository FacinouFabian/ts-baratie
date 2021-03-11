import chalk from 'chalk'
import cluster from 'cluster'

import Order from './Order'
import Cook from './Cook'

type Ingredient = {
  name: string
  stock: number
}

export default class Kitchen {
  id: string
  orders: Order[]
  cooks: Cook[]
  isInit: boolean
  ingredients: Ingredient[]

  constructor(id: string) {
    this.id = id
    this.cooks = []
    this.isInit = false
    this.orders = []
    this.ingredients = [
      { name: 'octopus', stock: 5 },
      { name: 'soja sauce', stock: 5 },
      { name: 'rice', stock: 5 },
      { name: 'pork', stock: 5 },
      { name: 'eggs', stock: 5 },
      { name: 'noodle', stock: 5 },
      { name: 'chicken', stock: 5 },
      { name: 'dough', stock: 5 },
      { name: 'matcha', stock: 5 },
      { name: 'chocolate', stock: 5 },
      { name: 'chief love', stock: 5 },
    ]
  }

  addCooks(cooks: Cook): void {
    this.cooks.push(cooks)
  }

  addOrder(order: Order): void {
    this.orders.push(order)
  }

  init(): void {
    console.log(chalk.bold.blue(`[Reception] -->> opened kitchen ${this.id}`))

    setTimeout(() => {
      this.ingredients.map(ingredient => {
        ingredient.stock++
      })
    }, this.cooks.length * 1000)

    this.isInit = true
  }

  sendStatus(status: string): void {
    const worker = cluster.workers[this.id]
    if (worker) {
      worker.send({ type: 'STATUS', status })
    }
  }

  getSome(ingredientName: string): void {
    const item = this.ingredients.find(ingredient => ingredient.name == ingredientName)
    if (item) item.stock - 1
  }

  // say the kitchen is inactive for closing
  sayInactive(): void {
    this.sendStatus('INACTIVE')
  }
}
