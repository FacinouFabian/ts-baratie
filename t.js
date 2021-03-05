/* eslint-disable @typescript-eslint/no-var-requires */
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

class Person {
  constructor(name, surname) {
    this.name = name
    this.surname = surname
  }

  fullname() {
    return `${this.name} ${this.surname}`
  }

  static whoAmI() {
    return 'a Person'
  }
}

if (isMainThread) {
  const foo = new Person('foo', 'bar')
  const worker = new Worker(__filename, {})

  worker.on('message', m => {
    console.log(`worker message: ${JSON.stringify(m)}`)
  })
  worker.postMessage(foo) // foo is serialized
} else {
  parentPort.on('message', foo => {
    console.log(`in worker, foo is like: ${JSON.stringify(foo)}`)
    parentPort.postMessage(foo)
  })
}
