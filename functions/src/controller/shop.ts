import * as admin from "firebase-admin";
import {Response} from "firebase-functions/v1";
import {ExtendRequest} from "../../types/http";

const firestore = admin.firestore();

export const shopMe = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentShop) {
      res.sendStatus(503);
      return;
    }

    const shop = await firestore
      .collection("shops")
      .doc(req.currentShop.uid)
      .get();

    if (!shop) {
      res.sendStatus(404);
      return;
    }

    res.json(shop.data());
  } catch (error) {
    res.sendStatus(503);
  }
};
