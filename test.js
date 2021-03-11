/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'
const { parentPort } = require('worker_threads')
let increment = 0
while (increment !== Math.pow(10, 10)) {
  increment++
}
const message = 'yo'
parentPort.postMessage(message)
