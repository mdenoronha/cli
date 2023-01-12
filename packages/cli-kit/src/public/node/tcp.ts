import {debug, content, token} from '../../output.js'
import {Abort} from '../../error.js'
import {sleep} from './system.js'
import * as port from 'get-port-please'

/**
 * Returns an available port in the current environment.
 *
 * @returns A promise that resolves with an availabe port.
 * @example
 */
export async function getAvailableTCPPort(): Promise<number> {
  debug(content`Getting a random port...`)
  const randomPort = await retryOnError(() => port.getRandomPort())
  debug(content`Random port obtained: ${token.raw(`${randomPort}`)}`)
  return randomPort
}

/**
 * Given a function, it runs it and retries in case of failiure up to the provided number of times.
 *
 * @param execute - The function to execute.
 * @param maxTries - The maximum retries.
 * @param waitTimeInSeconds - The time to wait between retries.
 */
async function retryOnError<T>(execute: () => T, maxTries = 5, waitTimeInSeconds = 1) {
  let retryCount = 1
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await execute()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (retryCount++ < maxTries) {
        debug(content`Unknown problem getting a random port: ${error.message}`)
        // eslint-disable-next-line no-await-in-loop
        await sleep(waitTimeInSeconds)
      } else {
        throw new Abort(error.message)
      }
    }
  }
}
