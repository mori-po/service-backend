import * as functions from 'firebase-functions'
import { cors } from '../utils/cors'
import {
  generateOnetimeNonce,
  listHoldingPointTickets,
} from '../controller/pointTicket'
import { verifyAuthHeader } from '../utils/auth'

export const pointticket = functions
  .region('asia-northeast1')
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
        case '/':
          if (req.method === 'GET') {
            req = await verifyAuthHeader(req, res)
            await listHoldingPointTickets(req, res)
            return
          }
          break
        case '/onetime-nonce':
          if (req.method === 'POST') {
            await generateOnetimeNonce(req, res)
            return
          }
          break
      }
      res.statusCode = 404
      res.statusMessage = 'Not found'
      res.send()
    })
  })
