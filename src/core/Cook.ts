import cluster from 'cluster'

import Dish from './Dish'
import Kitchen from './Kitchen'

const recipes = {
  takoyaki: { ingredients: ['octopus', 'soja sauce'], time: 1 },
  katsudon: { ingredients: ['rice', 'pork', 'eggs'], time: 2 },
  udon: { ingredients: ['noodle', 'pork', 'eggs'], time: 2 },
  ramen: { ingredients: ['noodle', 'chicken', 'eggs'], time: 2 },
  matchaCookie: { ingredients: ['dough', 'matcha', 'chocolate', 'chief love'], time: 4 },
}

export default class Cook {
  cookId: string
  kitchen: Kitchen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dishes: Dish[]

  constructor(id: string, kitchen: Kitchen) {
    this.cookId = id
    this.kitchen = kitchen
    this.dishes = []
  }

  init(): void {
    console.log(`[Kitchen ${this.kitchen.id}] -->> cook ${this.cookId} available.`)
  }

  assignDish(dish: Dish): void {
    this.dishes.push(dish)
  }

  sendStatus(status: string, dish: Dish): void {
    const worker = cluster.workers[this.kitchen.id]
    if (worker) {
      worker.send({ type: 'STATUS', status, dish })
    }
  }

  prepareDish(dish: Dish): void {
    const recipe = recipes[dish.type]
    const time = recipe.time * 1000
    recipe.ingredients.map(ingredient => {
      this.kitchen.getSome(ingredient)
    })

    setTimeout(() => {
      dish.ready = true
      this.sendStatus('DISH READY', dish)
    }, time)
  }
}
