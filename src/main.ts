import * as os from 'os'
import cluster from 'cluster'
import chalk from 'chalk'
import _ from 'lodash'
import { isMainThread, parentPort } from 'worker_threads'
import Pool from 'worker-threads-pool'

import Kitchen from './core/Kitchen'
import Reception from './core/Reception'

type Message = {
  type: 'INFORMATION' | 'STATUS'
  kitchenId?: string
  content?: string
  status?: string
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

        kitchen.on('message', (message: { content: string }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sender: any = processesMap.filter(item => item.id == kitchen.id)
          console.log(chalk.red('INFORMATION'), chalk.yellow(`[RECEPTION] Message from kitchen -->> ${sender[0].id}`))
          console.log(chalk.green(`Content: ${message.content}`))
        })

        if (cluster.workers[id]) {
          const kitchenItem = new Kitchen(id.toString(), 5)
          kitchens.push(kitchenItem)
          reception.kitchens = kitchens
          processesMap.push(cluster.workers[id] as cluster.Worker)
        }

        reception.kitchens.map(item => {
          if (!item.isInit) {
            item.init()
          }
        })
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

    reception.status()

    reception.sendToKitchen({
      type: 'INFORMATION',
      kitchenId: '01',
      content: 'string',
    })

    kitchens[0].sendStatus('ORDER READY')
  } else {
    // messages from reception
    process.on('message', (message: Message) => {
      if (message.type == 'INFORMATION' && message.kitchenId == process.env.kitchenId) {
        console.log(
          chalk.red('INFORMATION'),
          chalk.yellow(`[KITCHEN -->> ${process.env.kitchenId}] Message from reception`),
        )
        console.log(chalk.green(`Content: ${message.content}`))
        if (process.send) {
          process.send({ content: 'Thanks' })
        }
      }
    })

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

    /* if (isMainThread) {
      const pool = new Pool({ max: 5 })

      for (let i = 0; i < 5; i++) {
        pool.acquire('./test.js', function (err, worker) {
          if (err) throw err

          worker.on('online', () => {
            console.log(`Launching cook ${i}`)
          })

          worker.on('message', messageFromWorker => {
            console.log(`received: ${messageFromWorker} from cook ${i}`)
          })

          worker.on('error', error => {
            console.log(`Error from cook ${i} --> ${error}`)
          })

          worker.on('exit', code => {
            if (code !== 0) {
              console.log(new Error(`cook ${i} stopped with exit code ${code}`))
            }
          })
        })
      }
    } */
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
