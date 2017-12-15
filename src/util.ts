import { createHash, randomBytes, createCipher, createDecipher } from "crypto"
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

const algorithm = "aes-256-ctr"

export const encrypt: (data: string) => string =
  ((algo, key) =>
    data => {
      const cipher = createCipher(algo, key)
      let crypted = cipher.update(data, "utf8", "hex")
      crypted += cipher.final("hex")
      return crypted
    }
  )(algorithm, process.env.PASSWORD_ENCRYPT_KEY)

export const decrypt: (data: string) => string =
  ((algo, key) =>
    data => {
      const decipher = createDecipher(algo, key)
      let decrypted = decipher.update(data, "hex", "utf8")
      decrypted += decipher.final("utf8")
      return decrypted
    }
  )(algorithm, process.env.PASSWORD_ENCRYPT_KEY)
