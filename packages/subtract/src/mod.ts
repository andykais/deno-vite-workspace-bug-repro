import { Logger } from "./lib/logger.ts"

const logger = new Logger()

export function subtract(a: number, b: number) {
  logger.info(`subtract ${a} - ${b}`)
  return a - b
}
