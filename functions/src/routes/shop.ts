import * as functions from "firebase-functions";
import {cors} from "../utils/cors";
import {
  getPointTicketPrice,
  usePointTicket,
  listUsedPointTicketsHistory,
} from "../controller/pointTicket";
import {verifyAuthHeader} from "../utils/auth";
import {shopMe} from "../controller/shop";
import {errorTypes} from "../utils/errorHandling";

export const shop = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
      case "/":
        if (req.method === "GET") {
          req = await verifyAuthHeader(req, res);
          await shopMe(req, res);
        }
        break;
      case "/pointticket":
        if (req.method === "GET") {
          req = await verifyAuthHeader(req, res);
          await getPointTicketPrice(req, res);
        } else if (req.method === "POST") {
          req = await verifyAuthHeader(req, res);
          await usePointTicket(req, res);
        }
        break;
      case "/pointticket/history":
        if (req.method === "GET") {
          req = await verifyAuthHeader(req, res);
          await listUsedPointTicketsHistory(req, res);
          return;
        }
        break;
      default:
        break;
      }
      res.status(405).send(errorTypes[405]);
    });
  });
