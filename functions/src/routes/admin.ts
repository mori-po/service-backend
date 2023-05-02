import * as functions from 'firebase-functions'
import { cors } from '../utils/cors'
import {
  getTotalSupplyUsedValue,
  getTotalSupplyUsedValueByVoucherId,
  getUsedTicketCSV,
  getVoucherList,
} from '../controller/admin'
import { errorTypes } from '../utils/errorHandling'
import { warn } from 'firebase-functions/logger'

export const admin = functions
  .region('asia-northeast1')
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
        case `/get-eventlist-${process.env.ADMIN_URL_SALT}`:
          if (req.method === 'GET') {
            await getVoucherList(req, res)
            return
          }
          break
        case `/get-totalsupplyusedvalue-${process.env.ADMIN_URL_SALT}`:
          if (req.method === 'GET') {
            await getTotalSupplyUsedValue(req, res)
            return
          }
          break
        case `/get-totalsupplyusedvaluebyvoucherid-${process.env.ADMIN_URL_SALT}`:
          if (req.method === 'GET') {
            await getTotalSupplyUsedValueByVoucherId(req, res)
            return
          }
          break
        case `/get-totalsupplyusedvaluecsv-${process.env.ADMIN_URL_SALT}`:
          if (req.method === 'GET') {
            await getUsedTicketCSV(req, res)
            return
          }
          break
        default:
          break
      }

      warn(errorTypes[405])
      res.status(405).send(errorTypes[405])
    })
  })
