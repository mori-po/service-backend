import { Request as FirebaseRequest } from 'firebase-functions/v1/https'

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

export interface ExtendRequest extends FirebaseRequest {
  currentUser?: LineVerifiedData
}
