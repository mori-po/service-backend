import * as admin from 'firebase-admin'
import { Response } from 'firebase-functions/v1'
import { Request } from 'firebase-functions/v1/https'
import { ExtendRequest } from '../../types/http'
import { Ticket } from '../../types/ticket'

const firestore = admin.firestore()

export const listHoldingPointTickets = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentUser) {
      res.sendStatus(403)
      return
    }

    const ticketsKV: Ticket[] = []
    const tickets = await firestore
      .collection('pointTickets')
      .where('user_id', '==', req.currentUser.sub)
      .get()
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as any)
    })

    res.json(ticketsKV)
  } catch (error) {
    res.sendStatus(404)
  }
}

export const generateOnetimeNonce = async (req: Request, res: Response) => {
  res.json({ nonce: 'doaf0psadjfa81' })
}
