import db, { getJSON } from "./db"
import { hash, randomString, encrypt, decrypt } from "../util"

export interface UserId extends String {}
export interface InputUserData {
  username: string,
  password: string,
  address: string,
}
export interface UserData extends InputUserData {
  userId: UserId,
  authenticationToken: string,
}

export async function createUser(data: InputUserData & Partial<UserData>): Promise<UserData> {
  const userId = hash(data.username)
  const existingData: UserData | null = await getUser(userId)
  const authenticationToken = await randomString(20)

  const returnData: UserData = {
    userId,
    authenticationToken,
    ...existingData,
    ...data
  }

  const setData: UserData = {
    ...returnData,
    password: encrypt(returnData.password)
  }

  const ref = db.ref("users/" + userId)
  await ref.set(setData)
  return returnData
}

export async function getUser(userId: UserId): Promise<UserData> {
  const ref = db.ref("users/" + userId)
  const data = await getJSON<UserData>(ref)

  let password: string = undefined
  try {
    password = decrypt(data.password)
  } catch (_) { }

  const returnData: UserData = {
    ...data,
    password
  }
  return returnData
}

export async function deleteUser(userId: UserId): Promise<void> {
  const ref = db.ref("users/" + userId)
  await ref.set(null)
}
