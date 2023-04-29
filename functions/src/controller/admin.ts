import * as admin from "firebase-admin";
import {Request, Response} from "firebase-functions/v1";
import {Ticket} from "../../types/ticket";
import {errorTypes} from "../utils/errorHandling";

const firestore = admin.firestore();

export const getTicketSupplyUsedValueByVoucherId = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.query.voucher_id) {
      res.status(400).send(errorTypes[400]);
      return;
    }

    const ticketsKV: Ticket[] = [];
    const tickets = await firestore
      .collection("pointTickets")
      .where("pointVoucher_id", "==", String(req.query.voucher_id))
      .get();
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as Ticket);
    });

    const clacData = {maxSupply: 0, usedValue: 0};
    for (const ticket of ticketsKV) {
      clacData.maxSupply += ticket.amount;
      if (ticket.used_at) clacData.usedValue += ticket.amount;
    }

    res.json(clacData);
    return;
  } catch (error) {
    res.status(500).send(errorTypes[500]);
    return;
  }
};
