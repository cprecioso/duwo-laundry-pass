import * as express from "express"
import { resolve } from "path"
import { readFileSync } from "fs"
import { getInitialPass } from "../logic"
import { URL } from "url"
import passServer from "./pass"
import * as isEmail from "is-email"
import { randomString, delay } from "../util"
import { middleware as stylus } from "stylus"

const app = express()

const passServerMountPath = "/pass"

app.use(passServerMountPath, passServer)

app.set("views", resolve(__dirname, "../../views"))
app.set("view engine", "pug")

interface TemporaryPass {
  pass: Promise<Buffer>,
  url: string
}
const temporaryPasses = new Map<string, TemporaryPass>()

async function removePass(temporaryId: string) {
  await delay(10 * 60 * 1000)
  temporaryPasses.delete(temporaryId)
}

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/opensource", (req, res) => {
  res.render("opensource")
})

app.post("/createPass", express.urlencoded({ extended: false }), async (req, res) => {
  try {

    const { username, password, url } = req.body as { [key: string]: string }
    const address = new URL(passServerMountPath, url).href

    if (!isEmail(username) || !password || !address) throw {
      httpCode: 403,
      message: "Invalid data"
    }

    const pass = getInitialPass({ username, password }, address)

    const temporaryId = await randomString(16)
    temporaryPasses.set(temporaryId, {pass, url})
    res.redirect(`/passes/${temporaryId}`)

    removePass(temporaryId)

  } catch (err) {
    debugger
    const error = err.message || err
    res.status(error.httpCode || 500).render("error", { error })
  }
})

app.get("/passes/:id", (req, res) => {
  try {
    const passInfo = temporaryPasses.get(req.params.id)
    if (!passInfo) throw {
      httpCode: 403,
      message: "This pass doesn't exist or has expired"
    }
    res.render("pass", {
      passUrl: new URL(`/passes/${req.params.id}/laundry.pkpass`, passInfo.url).href
    })
  } catch (err) {
    debugger
    const error = err.message || err
    res.status(error.httpCode || 500).render("error", {error})
  }
})

app.get("/passes/:id/laundry.pkpass", async (req, res) => {
  try {
    const {pass} = temporaryPasses.get(req.params.id)
    if (!pass) throw {
      httpCode: 403,
      message: "This pass doesn't exist or has expired"
    }
    res.type("application/vnd.apple.pkpass").send(await pass)
  } catch (err) {
    debugger
    const error = err.message || err
    res.status(error.httpCode || 500).render("error", { error })
  }
})

app.use(stylus(resolve(__dirname, "../../public")));
app.use("/", express.static(resolve(__dirname, "../../public")))

app.use((req, res) => {
  res.status(404).render("error", { error: "Can't find that page" })
})

export default app
