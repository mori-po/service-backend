import * as admin from 'firebase-admin'
import { Response } from 'firebase-functions/v1'
import { error, warn } from 'firebase-functions/logger'
import { ExtendRequest } from '../../types/http'
import { errorTypes } from '../utils/errorHandling'

const firestore = admin.firestore()

export const shopMe = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentShop) {
      warn(errorTypes[401])
      res.status(401).send(errorTypes[401])
      return
    }

    const shop = await firestore
      .collection('shops')
      .doc(req.currentShop.uid)
      .get()

    if (!shop) {
      warn(errorTypes[404])
      res.status(404).send(errorTypes[404])
      return
    }

    res.json(shop.data())
  } catch (err) {
    error(err)
    res.status(500).send(errorTypes[500])
  }
}
