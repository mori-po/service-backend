import * as admin from "firebase-admin";
import {Response} from "firebase-functions/v1";
import {ExtendRequest} from "../../types/http";
import {Ticket} from "../../types/ticket";
import * as uuid from "uuid";
import * as dayjs from "dayjs";
import {errorTypes} from "../utils/errorHandling";

const firestore = admin.firestore();

export const listHoldingPointTickets = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentUser) {
      res.status(401).send(errorTypes[401]);
      return;
    }

    const ticketsKV: Ticket[] = [];
    const tickets = await firestore
      .collection("pointTickets")
      .where("user_id", "==", req.currentUser.sub)
      .get();
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as Ticket);
    });

    res.json(ticketsKV);
  } catch (error) {
    res.status(500).send(errorTypes[500]);
  }
};

export const listUsedPointTicketsHistory = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentShop?.uid) {
      res.status(401).send(errorTypes[401]);
      return;
    }

    const ticketsKV: Ticket[] = [];
    const tickets = await firestore
      .collection("pointTickets")
      .where("shop_id", "==", req.currentShop.uid)
      .get();
    tickets.forEach((doc) => {
      ticketsKV.push(doc.data() as Ticket);
    });

    res.json(ticketsKV);
  } catch (error) {
    res.status(500).send(errorTypes[500]);
  }
};

export const generateOnetimeNonce = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (!req.currentUser?.sub || !req.body.ids || req.body.ids.length === 0) {
      res.status(400).send(errorTypes[400]);
      return;
    }

    const tickets = await firestore
      .collection("pointTickets")
      .where("id", "in", req.body.ids)
      .get();
    tickets.forEach((ticket) => {
      const ticketKV = ticket.data() as Ticket;
      if (ticketKV.used_at || ticketKV.user_id !== req.currentUser?.sub) {
        res.status(400).send(errorTypes[400]);
        return;
      }
    });

    const nonce = uuid.v4();
    const expiredAt = dayjs().add(5, "minutes").unix();

    await firestore
      .collection("pointTicketNonces")
      .doc(nonce)
      .set({point_ticket_ids: req.body.ids, expired_at: expiredAt});

    res.json({nonce, expired_at: expiredAt});
  } catch (error) {
    res.status(500).send(errorTypes[500]);
  }
};

export const getPointTicketPrice = async (
  req: ExtendRequest,
  res: Response
) => {
  try {
    if (
      !req.currentShop?.uid ||
      !req.query.nonce ||
      typeof req.query.nonce !== "string"
    ) {
      res.status(400).send(errorTypes[400]);
      return;
    }

    const nonce = (
      await firestore.collection("pointTicketNonces").doc(req.query.nonce).get()
    ).data();
    if (!nonce || dayjs().unix() > nonce.expired_at) {
      res.status(400).send({...errorTypes[400], detail: "invalid nonce"});
      return;
    }

    const pointTickets = await firestore
      .collection("pointTickets")
      .where("id", "in", nonce.point_ticket_ids)
      .get();
    if (pointTickets.docs.length === 0) {
      res.status(400).send({...errorTypes[400]});
      return;
    }
    let price = 0;
    pointTickets.forEach((ticket) => {
      const ticketVK = ticket.data() as Ticket;
      if (ticketVK.used_at || ticketVK.shop_id) {
        res
          .status(400)
          .send({...errorTypes[400], detail: "ticket already used"});
        return;
      }
      price += ticketVK.amount;
    });

    res.json({price});
  } catch (error) {
    res.status(500).send(errorTypes[500]);
  }
};

export const usePointTicket = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentShop?.uid || !req.body.nonce) {
      res.status(400).send(errorTypes[400]);
      return;
    }

    const shop = (
      await firestore.collection("shops").doc(req.currentShop.uid).get()
    ).data();
    if (!shop || !shop.active) {
      res.status(401).send({...errorTypes[401], detail: "shop is not active"});
      return;
    }

    const nonce = (
      await firestore.collection("pointTicketNonces").doc(req.body.nonce).get()
    ).data();
    if (!nonce || dayjs().unix() > nonce.expired_at) {
      res.status(400).send({...errorTypes[400], detail: "invalid nonce"});
      return;
    }
    const pointTickets = await firestore
      .collection("pointTickets")
      .where("id", "in", nonce.point_ticket_ids)
      .get();
    if (pointTickets.docs.length === 0) {
      res.status(400).send({...errorTypes[400], detail: "invalid nonce"});
      return;
    }
    pointTickets.forEach((ticket) => {
      const ticketKV = ticket.data() as Ticket;
      if (ticketKV.used_at || ticketKV.shop_id) {
        res
          .status(400)
          .send({...errorTypes[400], detail: "ticket already used"});
        return;
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
    res.status(500).send(errorTypes[500]);
  }
};
