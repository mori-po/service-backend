import * as admin from 'firebase-admin'
import { Request, Response } from 'firebase-functions/v1'
import { ExtendRequest } from '../../types/http'
import { Voucher } from '../../types/voucher'
import * as dayjs from 'dayjs'
import { Ticket } from '../../types/ticket'
import { v4 } from 'uuid'

const firestore = admin.firestore()

export const findPointVaucher = async (req: Request, res: Response) => {
  try {
    // const id = req.query.id;
    // if (!id || typeof id !== "string") {
    //   res.sendStatus(404);
    //   return;
    // }

    // const voucher = (
    //   await firestore.collection("pointVoucher").doc(id).get()
    // ).data();
    const voucher = firestore.collection('pointVouchers')
    await voucher.doc('1235').set({
      id: '1235',
      event_name: 'ゴミ拾い',
      event_description: 'みんなでゴミ拾いをしよう！\nみんなで楽しもう！',
      event_image:
        'https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png',
      location: '35.680885, 139.769252',
      location_name: '東京駅',
      point_amount: 200,
      max_supply: 100,
      max_receivable_tickets: 2,
      event_date: 1677423600,
      expired_at: 1680274800,
    })

    if (voucher) {
      res.json(voucher)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.sendStatus(404)
  }
  return
}

export const earnPointTicket = async (req: ExtendRequest, res: Response) => {
  try {
    const id = req.body.id
    if (!id || typeof id !== 'string' || !req.currentUser) {
      res.sendStatus(403)
      return
    }

    const voucher = (
      await firestore.collection('pointVouchers').doc(id).get()
    ).data() as Voucher
    if (!voucher) {
      res.sendStatus(404)
      return
    }
    if (dayjs().diff(voucher.expired_at) < 0) {
      res.sendStatus(403)
      return
    }

    const tickets: Ticket[] = (
      await firestore
        .collection('pointTicket')
        .where('user_id', '==', req.currentUser.sub)
        .where('pointVoucher_id', '==', id)
        .get()
    ).docs as any
    if (tickets.length == voucher.max_receivable_tickets) {
      res.sendStatus(403)
      return
    }

    const ticketId = v4()

    const ticket: Ticket = {
      id: ticketId,
      user_id: req.currentUser.sub,
      amount: voucher.point_amount,
      usedAt: null,
      pointVoucher_id: id,
      pointVoucher: voucher,
    }
    await firestore.collection('pointTickets').doc(ticketId).set(ticket)

    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(403)
  }
}
