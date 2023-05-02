import * as admin from 'firebase-admin'
import * as dayjs from 'dayjs'
import { Request, Response } from 'firebase-functions/v1'
import { Ticket } from '../../types/ticket'
import { errorTypes } from '../utils/errorHandling'
import { Voucher } from '../../types/voucher'
import { Shop } from '../../types/shop'
import { error, warn } from 'firebase-functions/logger'

const firestore = admin.firestore()

export const getVoucherList = async (req: Request, res: Response) => {
  try {
    const vouchersKV: Voucher[] = []
    const vouchers = await firestore.collection('pointVouchers').get()
    vouchers.forEach((doc) => {
      vouchersKV.push(doc.data() as Voucher)
    })

    return res.setHeader('Content-Type', 'text/html').send(
      vouchersKV
        .map((voucher) => {
          return `${voucher.event_name}@${dayjs(
            new Date(voucher.event_date * 1000)
          ).format('YYYY月MM日DD')}: <a href="${
            process.env.FIREFUNCTION_ENDPOINT_URL
          }/admin/get-totalsupplyusedvaluebyvoucherid-${
            process.env.ADMIN_URL_SALT
          }?voucher_id=${voucher.id}" target="_blank">イベントデータ</a>`
        })
        .join('<br/>')
    )
  } catch (err) {
    error(err)
    res.status(500).send(errorTypes[500])
    return
  }
}

export const getTotalSupplyUsedValueByVoucherId = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.query.voucher_id) {
      warn(errorTypes[400])
      res.status(400).send(errorTypes[400])
      return
    }

    const ticketsKV: Ticket[] = []
    const tickets = await firestore
      .collection('pointTickets')
      .where('pointVoucher_id', '==', String(req.query.voucher_id))
      .get()
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as Ticket)
    })

    const clacData = { maxSupply: 0, usedValue: 0 }
    for (const ticket of ticketsKV) {
      clacData.maxSupply += ticket.amount
      if (ticket.used_at) clacData.usedValue += ticket.amount
    }

    res.json(clacData)
    return
  } catch (err) {
    error(err)
    res.status(500).send(errorTypes[500])
    return
  }
}

export const getTotalSupplyUsedValue = async (req: Request, res: Response) => {
  try {
    const ticketsKV: Ticket[] = []
    const tickets = await firestore.collection('pointTickets').get()
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as Ticket)
    })

    const clacData = { maxSupply: 0, usedValue: 0 }
    for (const ticket of ticketsKV) {
      clacData.maxSupply += ticket.amount
      if (ticket.used_at) clacData.usedValue += ticket.amount
    }

    res.json(clacData)
    return
  } catch (err) {
    error(err)
    res.status(500).send(errorTypes[500])
    return
  }
}

export const getUsedTicketCSV = async (req: Request, res: Response) => {
  try {
    const ticketsKV: Ticket[] = []
    const tickets = await firestore
      .collection('pointTickets')
      .where('shop_id', '!=', null)
      .get()
    tickets.forEach((doc) => {
      if (!doc.data().shop_id) return
      ticketsKV.push(doc.data() as Ticket)
    })

    const shopsKV: Shop[] = []
    const shops = await firestore.collection('shops').get()
    shops.forEach((doc) => {
      shopsKV.push(doc.data() as Shop)
    })

    let csvString =
      'ticket_id,user_id,shop_id,shop_name,amount,used_at,event_name,event_at\n'
    for (const ticket of ticketsKV.sort((a, b) => {
      if (!a.shop_id || !b.shop_id) return 0
      if (a.shop_id < b.shop_id) return -1
      if (a.shop_id > b.shop_id) return 1
      return 0
    })) {
      if (!ticket.shop_id) continue
      csvString += `${ticket.id},${ticket.user_id},${ticket.shop_id},${
        shopsKV.find((shop) => shop.uid === ticket.shop_id)?.name
      },${ticket.amount},${dayjs(
        new Date((ticket.used_at || 0) * 1000)
      ).toDate()},${ticket.pointVoucher.event_name},${dayjs(
        new Date(ticket.pointVoucher.event_date * 1000)
      ).toDate()}\n`
    }

    res.setHeader('Content-Type', 'text/csv').send(csvString)
  } catch (err) {
    error(err)
    res.status(500).send(errorTypes[500])
    return
  }
}
