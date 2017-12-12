import * as admin from "firebase-admin"

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB
})

const db = admin.database()

export default db

export async function getJSON<T extends any>(ref: admin.database.Reference): Promise<T> {
  const snapshot = await ref.once("value") as admin.database.DataSnapshot
  return snapshot.toJSON() as any
}
