import * as admin from "firebase-admin";
import {Response} from "firebase-functions/v1";
import {ExtendRequest} from "../../types/http";
import {errorTypes} from "../utils/errorHandling";

const firestore = admin.firestore();

export const shopMe = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentShop) {
      res.status(401).send(errorTypes[401]);
      return;
    }

    const shop = await firestore
      .collection("shops")
      .doc(req.currentShop.uid)
      .get();

    if (!shop) {
      res.status(404).send(errorTypes[404]);
      return;
    }

    res.json(shop.data());
  } catch (error) {
    res.status(500).send(errorTypes[500]);
  }
};
