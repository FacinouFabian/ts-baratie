import chalk from 'chalk'
import cluster from 'cluster'
import { Worker, isMainThread, parentPort } from 'worker_threads'

import Order from './Order'
import Cook from './Cook'

type Ingredient = {
  name: string
  stock: number
}

export default class Kitchen {
  id: string
  nbCookers: number
  orders: Order[]
  cooks: Cook[]
  isInit: boolean
  ingredients: Ingredient[]

  constructor(id: string, nbCookers: number) {
    this.id = id
    this.nbCookers = nbCookers
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

  addOrder(order: Order): void {
    this.orders.push(order)
    // TODO
    // send order to cooks
  }

  init(): void {
    console.log(chalk.bold.blue(`[Reception] -->> opened kitchen ${this.id}`))
    // add cooks and initialize them
    for (let i = 0; i < this.nbCookers; i++) {
      const newCook = new Cook((i + 1).toString(), this)
      this.cooks.push(newCook)
    }

    if (isMainThread) {
      console.log('i am main')
      /* for (let i = 0; i < this.nbCookers; i++) {
        const myId = i.toString().padStart(2, '0')
        const newCook = new Cook((i + 1).toString(), this)
        const worker = new Worker(__filename, { env: { cookId: myId } })

        worker.on('message', m => {
          console.log(`worker message: ${JSON.stringify(m)}`)
        })
        worker.postMessage(newCook) // foo is serialized
      } */
    } else {
      console.log('i am not main')
      /* parentPort?.on('message', newCook => {
        console.log(`in worker, newCook is like: ${JSON.stringify(newCook)}`)
        parentPort?.postMessage(newCook)
      }) */
    }

    this.cooks.map(cook => cook.init())

    setTimeout(() => {
      this.ingredients.map(ingredient => {
        ingredient.stock++
      })
    }, this.nbCookers * 1000)

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
