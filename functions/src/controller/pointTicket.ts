import * as admin from "firebase-admin";
import {Response} from "firebase-functions/v1";
import {Request} from "firebase-functions/v1/https";
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
  req: Request,
  res: Response
) => {
  // TODO: リクエストヘッダのショップ情報を使って絞り込む
  res.json([
    {
      id: 123,
      amount: 100,
      used_at: 1677423600,
      pointVoucher_id: 1,
      pointVoucher: {
        id: 1,
        event_name: "ゴミ拾い",
        event_description: "みんなでゴミ拾いをしよう！\nみんなで楽しもう！",
        event_image:
          "https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png",
        location: "35.680885, 139.769252",
        location_name: "東京駅",
        point_amount: 100,
        max_supply: 100,
        max_receivable_tickets: 2,
        event_date: 1677423600,
        expired_at: 1680274800,
      },
    },
    {
      id: 123,
      amount: 100,
      used_at: 1677423600,
      pointVoucher_id: 2,
      pointVoucher: {
        id: 2,
        event_name: "ゴミ拾い２",
        event_description:
          "みんなでたくさんゴミ拾いをしよう！\nみんなで楽しもう！",
        event_image:
          "https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png",
        location: "35.680885, 139.769252",
        location_name: "東京駅",
        point_amount: 100,
        max_supply: 100,
        max_receivable_tickets: 2,
        event_date: 1677423600,
        expired_at: 1680274800,
      },
    },
  ]);
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
      const ticketVK: Ticket = ticket.data() as any;
      if (ticketVK.used_at || ticketVK.user_id !== req.currentUser?.sub) {
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

export const getPointTicketPrice = async (req: Request, res: Response) => {
  // TODO: nonceが有効でない場合403エラー
  res.json({price: 100});
};
