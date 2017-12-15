import * as express from "express"
import { resolve } from "path"
import { readFileSync } from "fs"
import { getInitialPass } from "../logic"
import { URL } from "url"
import passServer from "./pass"
import * as isEmail from "is-email"
import { randomString, delay } from "../util"

const publicHtml = readFileSync(resolve(__dirname, "../../web/index.html"))

const app = express()

const passServerMountPath = "/pass"

app.use(passServerMountPath, passServer)

async function removePass(temporaryId: string) {
  await delay(10 * 60 * 1000)
  temporaryPasses.delete(temporaryId)
}

app.get("/", (req, res) => {
  res.set("Content-Type", "text/html")
  res.send(publicHtml)
})

const temporaryPasses = new Map<string, Promise<Buffer>>()

app.post("/", express.urlencoded({ extended: false }), async (req, res) => {
  try {

    const { username, password, url } = req.body as { [key: string]: string }
    const address = new URL(passServerMountPath, url).href

    if (!isEmail(username) || !password || !address) return res.redirect("/")

    const pass = getInitialPass({ username, password }, address)

    const temporaryId = await randomString(16)
    temporaryPasses.set(temporaryId, pass)
    res.redirect(`/passes/${temporaryId}/laundry.pkpass`)

    removePass(temporaryId)

  } catch (err) {
    debugger
    res.status(500).send(err)
  }
})

app.get("/passes/:id/laundry.pkpass", async (req, res) => {
  try {
    const pass = temporaryPasses.get(req.params.id)
    if (!pass) return res.redirect("/")
    res.type("application/vnd.apple.pkpass").send(await pass)
  } catch (err) {
    debugger
    res.status(500).send(err)
  }
})

export default app
