import { PassServerCallbacks, PassServerGetUpdatesResponse } from "pass-server"
import * as db from "../db"
import User from "multiposs"
import { TemplateData, createPass } from "../pass"

const baseUrl = "https://duwo.multiposs.nl/"

async function createPassFrom(user: User, userData: db.UserData) {
  return createPass({
    authenticationToken: userData.authenticationToken,
    balance: await user.balance,
    email: userData.username,
    id: "" + userData.userId,
    qrId: await user.qrId,
    webServiceURL: userData.address
  })
}

export async function getInitialPass({ username, password }, address: string): Promise<Buffer> {
  const user = new User(baseUrl, username, password)
  await user.loggedIn
  const userData = await db.createUser({ username, password, address })
  const pass = await createPassFrom(user, userData)
  return pass
}

export const onRegistration: PassServerCallbacks["onRegistration"] = async data => {
  const userId = data.identification.serialNumber
  const userData = await db.getUser(userId)
  if (!userData) return 401
  if (data.authorization.token !== userData.authenticationToken) return 401
  const deviceData = await db.createDevice({
    deviceId: data.identification.deviceLibraryIdentifier,
    pushToken: data.pushToken,
    pushProvider: data.authorization.provider,
    userId: userId
  })
  return 200
}

export const onGetUpdates: PassServerCallbacks["onGetUpdates"] = async data => {
  const deviceData = await db.getDevice(data.identification.deviceLibraryIdentifier)
  return {
    lastUpdated: ""+Date.now(),
    serialNumbers: [deviceData.userId]
  } as PassServerGetUpdatesResponse
}

export const onGetPass: PassServerCallbacks["onGetPass"] = async data => {
  const userId = data.identification.serialNumber
  const userData = await db.getUser(userId)
  if (!userData) return 401
  if (data.authorization.token !== userData.authenticationToken) return 401
  const user = new User(baseUrl, userData.username, userData.password)
  const pass = createPassFrom(user, userData)
  return pass
}

export const onUnregistration: PassServerCallbacks["onUnregistration"] = async data => {
  const userId = data.identification.serialNumber
  const userData = await db.getUser(userId)
  if (!userData) return 401
  if (data.authorization.token !== userData.authenticationToken) return 401
  await db.deleteDevice(data.identification.deviceLibraryIdentifier)
  return 200
}

export const onLogError: PassServerCallbacks["onLogError"] = async data => {
  console.log(data.logs)
}
