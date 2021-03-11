import Pool from 'worker-threads-pool'
import cluster from 'cluster'
/**
 * Use a worker via Worker Threads module to make intensive CPU task
 * @param filepath string relative path to the file containing intensive CPU task code
 * @return {Promise(mixed)} a promise that contains result from intensive CPU task
 */
export default async (filepath: string, nb: number): Promise<void> => {
  const pool = new Pool({ max: nb })

  for (let i = 0; i < nb; i++) {
    pool.acquire(filepath, function (err, worker) {
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
}
