import creator from "pass-creator"

// needs updatiing

export default function createPass() {
  delete require.cache[require.resolve("./template")]
  const info = require("./template").default({
    id: "17311504804787",
    name: "Carlos Precioso",
    balance: 1245,
    webServiceURL: "http://192.168.31.10:8080/",
    authenticationToken: "abcdefghijklmnopqrstuvwxyz"
  })
  return creator(info)
}
