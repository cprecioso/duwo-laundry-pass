import server from "pass-server"
import * as logic from "../logic"

function createLogger<Arg, Ret>(name: string, fn: (arg: Arg) => Ret): (arg: Arg) => Ret {
  return arg => {
    const ret = fn(arg)
    Promise.all([name, arg, ret])
    .then(([name, arg, ret]) => console.log({ name, arg, ret }))
    return ret
  }
}

const app =
  server({
    onRegistration: createLogger("onRegistration", logic.onRegistration),
    onGetUpdates: createLogger("onGetUpdates", logic.onGetUpdates),
    onGetPass: createLogger("onGetPass", logic.onGetPass),
    onUnregistration: createLogger("onUnregistration", logic.onUnregistration),
    onLogError: createLogger("onLogError", logic.onLogError),
  })

export default app
