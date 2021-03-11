/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { parentPort } = require('worker_threads')

parentPort.postMessage('im ready!')
