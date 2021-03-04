import * as os from 'os'
import cluster from 'cluster'
import chalk from 'chalk'

import Kitchen from './core/Kitchen'
import Reception from './core/Reception'

type Message = {
  kitchenId: string
  content: string
}

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

    Object.keys(cluster.workers).map(id => {
      if (cluster.workers[id]) {
        const kitchenItem = new Kitchen(id, 5)
        kitchenItem.init()
        kitchens.push(kitchenItem)
        processesMap.push(cluster.workers[id] as cluster.Worker)
      }
    })

    const send = (message: Message) => {
      const target = processesMap.filter(item => item.id == parseInt(message.kitchenId))
      if (target) {
        target[0].send(message)
      }
    }

    const reception = new Reception(kitchens, send)

    await reception.init()

    /* reception.status() */

    reception.sendToKitchen({
      kitchenId: '01',
      content: 'string',
    })

    reception.sendToKitchen({
      kitchenId: '02',
      content: 'string',
    })
  } else {
    process.on('message', message => {
      if (message.kitchenId == process.env.kitchenId) {
        console.log(chalk.yellow(`[KITCHEN -->> ${process.env.kitchenId}] Message from reception`))
        console.log(chalk.green(`I received message: ${message.content}`))
        if (process.send) {
          process.send({ content: 'Thanks' })
        }
      }
    })
  }
}

main()
