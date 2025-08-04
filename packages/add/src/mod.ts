import * as logger from '@std/log'


export function add(a: number, b: number) {
  logger.info(`add ${a} + ${b}`)
  return a + b
}
