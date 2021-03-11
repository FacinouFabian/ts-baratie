// eslint-disable-next-line @typescript-eslint/no-var-requires
const cluster = require('cluster')

const recipes = {
  takoyaki: { ingredients: ['octopus', 'soja sauce'], time: 1 },
  katsudon: { ingredients: ['rice', 'pork', 'eggs'], time: 2 },
  udon: { ingredients: ['noodle', 'pork', 'eggs'], time: 2 },
  ramen: { ingredients: ['noodle', 'chicken', 'eggs'], time: 2 },
  matchaCookie: { ingredients: ['dough', 'matcha', 'chocolate', 'chief love'], time: 4 },
}

module.exports = class Cook {
  constructor(id, kitchen) {
    this.cookId = id
    this.kitchen = kitchen
    this.dishes = []
  }

  init() {
    console.log(`[Kitchen ${this.kitchen.id}] -->> cook ${this.cookId} available.`)
  }

  assignDish(dish) {
    this.dishes.push(dish)
  }

  sendStatus(status, dish) {
    const worker = cluster.workers[this.kitchen.id]
    if (worker) {
      worker.send({ type: 'STATUS', status, dish })
    }
  }

  prepareDish(dish) {
    const recipe = recipes[dish.type]
    const time = recipe.time * 1000
    /* recipe.ingredients.map(ingredient => {
      this.kitchen.getSome(ingredient)
    }) */

    setTimeout(() => {
      dish.ready = true
      this.sendStatus('DISH READY', dish)
    }, time)
  }
}
