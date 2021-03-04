import * as os from 'os'

import Reception from './core/Reception'

const numberCPUs = os.cpus().length

const main = async () => {
  const reception = new Reception(numberCPUs)

  await reception.init().then(() => {
    reception.status()
  })

  reception.sendToKitchen()
}

main()
