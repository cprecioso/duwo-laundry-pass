import { createHash, randomBytes } from "crypto"
import { promisify } from "util"

export const hash: (data: string) => string =
  data =>
    createHash("SHA256")
    .update(data)
    .digest("hex")

export const randomString: (length?: number) => Promise<string> =
  (randomBytes =>
    async (length = 10) =>
      (await randomBytes(length)).toString("hex")
  )(promisify(randomBytes))

export const delay: (ms: number) => Promise<void> =
  ms => new Promise(f => setTimeout(f, ms))
