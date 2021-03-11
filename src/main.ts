import * as os from 'os'
import cluster from 'cluster'
import chalk from 'chalk'
import _ from 'lodash'
import { isMainThread } from 'worker_threads'
import { Worker } from 'worker_threads'

import Kitchen from './core/Kitchen'
import Reception from './core/Reception'
import Dish from './core/Dish'

type Message = {
  type: 'INFORMATION' | 'STATUS' | 'ADD_COOKS' | 'ASSIGN_DISH'
  kitchenId?: string
  content?: string
  status?: string
  dish?: Dish
}

enum DishType {
  Takoyaki = 'takoyaki',
  Katsudon = 'katsudon',
  Udon = 'udon',
  Ramen = 'ramen',
  MatchaCookie = 'matchaCookie',
}

enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

const args: Array<number> = _.map(process.argv.slice(2), Number)
const numberCPUs = os.cpus().length

const main = async () => {
  const processesMap: cluster.Worker[] = []
  const kitchens: Kitchen[] = []

  if (cluster.isMaster) {
    // handler for communication with kitchens
    const send = (message: Message) => {
      if (message.kitchenId) {
        const id = message.kitchenId
        const target = processesMap.filter(item => item.id == parseInt(id))
        if (target) {
          target[0].send(message)
        }
      } else {
        return 'Missing parameter [kitchenId]'
      }
    }

    const reception = new Reception()

    const openKitchen = () => {
      if (processesMap.length < numberCPUs) {
        const myId = (processesMap.length + 1).toString().padStart(2, '0')
        const id = processesMap.length + 1
        const kitchen = cluster.fork({ kitchenId: myId })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kitchen.on('message', (message: any) => {
          if (message.type == 'ADD_KITCHEN') {
            kitchens.push(message.kitchen)

            console.log(
              chalk.red('[RECEPTION]'),
              chalk.yellow(`[INFORMATION] Added new kitchen -->> ${message.kitchen.id}`),
            )
          } else {
            kitchens.map(item => {
              if (item.id == message.kitchenID) {
                item.cooks = message.kitchen.cooks
              }
            })
            /* console.log(kitchens[0].cooks) */
          }
        })

        if (cluster.workers[id]) {
          processesMap.push(cluster.workers[id] as cluster.Worker)
        }
      } else {
        console.log("can't open more kitchens.")
      }
    }

    reception.send = send
    reception.openHandler = openKitchen

    // init reception
    await reception.init()

    // open kitchen
    reception.openKitchen()

    processesMap[0].send({
      type: 'ASSIGN_DISH',
      dish: new Dish(1, 1, DishType.Takoyaki, Size.S),
    })
    /*
    reception.status()
    kitchens[0].sendStatus('ORDER READY') */
  } else {
    const kitchen = new Kitchen(process.env.kitchenId as string)
    kitchen.init()

    if (process.send) {
      process.send({ type: 'ADD_KITCHEN', kitchen })
    }

    // messages from reception
    if (isMainThread) {
      const worker = new Worker('./pool-setup.js', {
        workerData: { kitchenID: process.env.kitchenId, nbCooks: 5 },
      })

      worker.on('online', () => {
        console.log('Preparing cooks...')
      })

      worker.on('message', messageFromWorker => {
        const cook = kitchen.cooks.find(item => item.cookId == messageFromWorker.cookId)
        if (cook) {
          cook.dishes = messageFromWorker.dishes
        } else {
          kitchen.cooks.push(messageFromWorker)
        }
        process.send && process.send({ type: 'UPDATE_KITCHEN', kitchenID: kitchen.id, kitchen })
      })

      worker.on('error', e => console.log(e))

      worker.on('exit', code => {
        if (code !== 0) {
          console.log(new Error(`Worker stopped with exit code ${code}`))
        }
      })

      process.on('message', (message: Message) => {
        if (message.type == 'ASSIGN_DISH') {
          worker.postMessage({ threadID: 2, dish: message.dish })
        }
      })
    }

    // messages from current kitchen
    cluster.worker.on('message', (message: Message) => {
      if (message.type == 'STATUS') {
        console.log(chalk.yellow('STATUS'), chalk.bold.red(`[KITCHEN -->> ${process.env.kitchenId}]`))
        console.log(chalk.bold.green(`I received status: ${chalk.yellowBright(message.status)}`))

        // status handler
        if (message.status == 'INACTIVE') {
          cluster.worker.kill()
        }
      }
    })
  }
}

if (args.length !== 3) {
  console.log(chalk.red('Usage: start <cooking_time> <cooks_per_kitchen> <regenerate_ingredients_time>'))
} else if (args.includes(NaN) || Math.min(...args) < 1 || _.sum(args) % 1 != 0) {
  console.log(chalk.red(`Usage: [ ${args.join(', ')} ] parameters must be positive integer numbers`))
  process.exit(0)
} else {
  main()
}
