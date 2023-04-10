import {Request as FirebaseRequest} from "firebase-functions/v1/https";

export type LineVerifiedData = {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  nonce: string
  amr: string[]
  name: string
  picture: string
  email: string
}

export type FirebaseAuthData = {
  name: string
  picture: string
  email: string
  email_verified: boolean
  auth_time: number
  user_id: string
  firebase: { identities: { email: any[] }; sign_in_provider: string }
  iat: number
  exp: number
  aud: string
  iss: string
  sub: string
  uid: string
}

export interface ExtendRequest extends FirebaseRequest {
  currentUser?: LineVerifiedData
  currentShop?: FirebaseAuthData
}
