import * as admin from "firebase-admin"

const accountCertificate = {
  type: process.env.FIREBASE_KEY_TYPE,
  project_id: process.env.FIREBASE_KEY_PROJECT_ID,
  private_key_id: process.env.FIREBASE_KEY_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_KEY_PRIVATE_KEY.replace(/\\n/giu, "\n"),
  client_email: process.env.FIREBASE_KEY_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_KEY_CLIENT_ID,
  auth_uri: process.env.FIREBASE_KEY_AUTH_URI,
  token_uri: process.env.FIREBASE_KEY_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_KEY_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_KEY_CLIENT_X509_CERT_URL,
} as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(accountCertificate),
  databaseURL: process.env.FIREBASE_DB
})

const db = admin.database()

export default db

export async function getJSON<T extends any>(ref: admin.database.Reference): Promise<T> {
  const snapshot = await ref.once("value") as admin.database.DataSnapshot
  return snapshot.toJSON() as any
}
