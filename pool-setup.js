/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { parentPort, workerData } = require('worker_threads')
const Pool = require('worker-threads-pool')
const Cook = require('./Cook')

const pool = new Pool({ max: workerData.nbCooks })

for (let i = 0; i < workerData.nbCooks; i++) {
  pool.acquire('./cook-setup.js', function (err, worker) {
    if (err) throw err

    /* worker.on('online', () => {
      console.log(`Cook ${i} ready!`)
    }) */

    const id = worker.threadId
    const cook = new Cook(id.toString(), workerData.kitchenID)

    worker.on('message', () => {
      parentPort.postMessage(cook)
    })

    worker.on('error', error => {
      console.log(`Error from cook ${i} --> ${error}`)
    })

    worker.on('exit', code => {
      if (code !== 0) {
        console.log(new Error(`cook ${i} stopped with exit code ${code}`))
      }
    })

    parentPort.on('message', message => {
      if (message.threadID == id) {
        cook.dishes.push(message.dish)
        parentPort.postMessage(cook)
      }
    })
  })
}
