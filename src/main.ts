import * as os from 'os'
import cluster from 'cluster'
import chalk from 'chalk'
import _ from 'lodash'

import Kitchen from './core/Kitchen'
import Reception from './core/Reception'

type Message = {
  kitchenId: string
  content: string
}

const args: Array<number> = _.map(process.argv.slice(2), Number)

if (args.length !== 3) {
  console.log(chalk.red('Usage: start <cooking_time> <cooks_per_kitchen> <regenerate_ingredients_time>'))
} else if (args.includes(NaN) || Math.min(...args) < 1 || _.sum(args) % 1 != 0) {
  console.log(chalk.red(`Usage: [ ${args.join(", ")} ] parameters must be positive integer numbers`))
  process.exit(0)
} else {

  const numberCPUs = os.cpus().length

  const main = async () => {
    const processesMap: cluster.Worker[] = []
    const kitchens: Kitchen[] = []

    if (cluster.isMaster) {
      for (let i = 0; i < numberCPUs; i++) {
        const myId = (i + 1).toString().padStart(2, '0')
        const kitchen = cluster.fork({ kitchenId: myId })

        kitchen.on('message', (message: { content: string }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sender: any = processesMap.filter(item => item.id == kitchen.id)
          console.log(chalk.yellow(`[RECEPTION] Message from kitchen -->> ${sender[0].id}`))
          console.log(chalk.green(`I received message: ${message.content}`))
        })
      }

      // create Kitchen class for each forked workers
      Object.keys(cluster.workers).map(id => {
        if (cluster.workers[id]) {
          const kitchenItem = new Kitchen(id, 5)
          kitchens.push(kitchenItem)
          processesMap.push(cluster.workers[id] as cluster.Worker)
        }
      })

      // handler for communication with kitchens
      const send = (message: Message) => {
        const target = processesMap.filter(item => item.id == parseInt(message.kitchenId))
        if (target) {
          target[0].send(message)
        }
      }

      const reception = new Reception(kitchens, send)

      // init reception
      await reception.init()

      // get kitchens status
      reception.status()

      // send message to kitchen
      reception.sendToKitchen({
        kitchenId: '01',
        content: 'string',
      })

      // open kitchen
      reception.openKitchen('2')

      // close kitchen
      reception.closeKitchen('2')

      // send status from kitchen to kitchen's cluster worker
      kitchens[2].sendStatus('ORDER READY')
    } else {
      // messages from reception
      process.on('message', message => {
        if (message.kitchenId == process.env.kitchenId) {
          console.log(chalk.yellow(`[KITCHEN -->> ${process.env.kitchenId}] Message from reception`))
          console.log(chalk.green(`I received message: ${message.content}`))
          if (process.send) {
            process.send({ content: 'Thanks' })
          }
        }
      })
      // messages from current kitchen
      cluster.worker.on('message', message => {
        if (message.type == 'status') {
          console.log(chalk.bold.red(`[KITCHEN -->> ${process.env.kitchenId}] received status`))
          console.log(chalk.bold.green(`I received status: ${chalk.yellowBright(message.status)}`))

          // status handler
          if (message.status == 'INACTIVE') {
            cluster.worker.kill()
          }
        }
      })
    }
  }

  main()
}