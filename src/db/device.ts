import db, { getJSON } from "./db"
import { UserId } from "./user";

export interface DeviceId extends String { }
export interface DeviceData {
  deviceId: DeviceId,
  pushToken: string,
  pushProvider: string,
  userId: UserId
}

export async function createDevice(data: DeviceData): Promise<DeviceData> {
  const ref = db.ref("devices/" + data.deviceId)
  await ref.set(data)
  return data
}

export async function getDevice(deviceId: DeviceId): Promise<DeviceData> {
  const ref = db.ref("devices/" + deviceId)
  return getJSON<DeviceData>(ref)
}

export async function deleteDevice(deviceId: DeviceId): Promise<void> {
  const ref = db.ref("devices/" + deviceId)
  await ref.set(null)
}
