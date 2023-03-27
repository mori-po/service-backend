import * as admin from "firebase-admin";
import {Response} from "firebase-functions/v1";
import {ExtendRequest} from "../../types/http";
import {Ticket} from "../../types/ticket";
import * as uuid from "uuid";
import * as dayjs from "dayjs";

const firestore = admin.firestore();

export const listHoldingPointTickets = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentUser) {
      res.sendStatus(403);
      return;
    }

    const ticketsKV: Ticket[] = [];
    const tickets = await firestore
      .collection("pointTickets")
      .where("user_id", "==", req.currentUser.sub)
      .get();
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as any);
    });

    res.json(ticketsKV);
  } catch (error) {
    res.sendStatus(404);
  }
};

export const listUsedPointTicketsHistory = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentShop?.uid) throw "invalid request";

    const ticketsKV: Ticket[] = [];
    const tickets = await firestore
      .collection("pointTickets")
      .where("shop_id", "==", req.currentShop.uid)
      .get();
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as any);
    });

    res.json(ticketsKV);
  } catch (error) {
    res.sendStatus(503);
  }
};

export const generateOnetimeNonce = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentUser?.sub || !req.body.ids || req.body.ids.length === 0) {
      throw null;
    }

    const tickets = await firestore
      .collection("pointTickets")
      .where("id", "in", req.body.ids)
      .get();
    tickets.forEach((ticket) => {
      const ticketKV: Ticket = ticket.data() as any;
      if (ticketKV.used_at || ticketKV.user_id !== req.currentUser?.sub) {
        throw null;
      }
    });

    const nonce = uuid.v4();
    const expired_at = dayjs().add(5, "minutes").unix();

    await firestore
      .collection("pointTicketNonces")
      .doc(nonce)
      .set({point_ticket_ids: req.body.ids, expired_at});

    res.json({nonce, expired_at});
  } catch (error) {
    res.sendStatus(503);
  }
};

export const getPointTicketPrice = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentShop?.uid || !req.query.nonce) throw "invalid request";

    const nonce = (
      await firestore.collection("pointTicketNonces").doc(req.query.nonce).get()
    ).data();
    if (!nonce || dayjs().unix() > nonce.expired_at) throw "invalid nonce";

    const pointTickets = await firestore
      .collection("pointTickets")
      .where("id", "in", nonce.point_ticket_ids)
      .get();
    if (pointTickets.docs.length === 0) throw "no tickets";
    let price = 0;
    pointTickets.forEach((ticket) => {
      const ticketVK: Ticket = ticket.data() as any;
      if (ticketVK.used_at || ticketVK.shop_id) {
        throw "ticket already used";
      }
      price += ticketVK.amount;
    });

    res.json({price});
  } catch (error) {
    res.sendStatus(403);
  }
};

export const usePointTicket = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentShop?.uid || !req.body.nonce) throw "invalid request";

    const shop = (
      await firestore.collection("shops").doc(req.currentShop.uid).get()
    ).data();
    if (!shop || !shop.active) throw "invalid shop";

    const nonce = (
      await firestore.collection("pointTicketNonces").doc(req.body.nonce).get()
    ).data();
    if (!nonce || dayjs().unix() > nonce.expired_at) throw "invalid nonce";
    const pointTickets = await firestore
      .collection("pointTickets")
      .where("id", "in", nonce.point_ticket_ids)
      .get();
    if (pointTickets.docs.length === 0) throw "no tickets";
    pointTickets.forEach((ticket) => {
      const ticketKV: Ticket = ticket.data() as any;
      if (ticketKV.used_at || ticketKV.shop_id) {
        throw "ticket already used";
      }
    });

    const now = dayjs().unix();

    pointTickets.forEach(async (ticket) => {
      await firestore.collection("pointTickets").doc(ticket.id).update({
        used_at: now,
        shop_id: req.currentShop?.uid,
      });
    });

    res.json({status: "success"});
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};
