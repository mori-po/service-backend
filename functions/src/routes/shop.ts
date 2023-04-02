import * as functions from "firebase-functions";
import {cors} from "../utils/cors";
import {
  getPointTicketPrice,
  usePointTicket,
  listUsedPointTicketsHistory,
} from "../controller/pointTicket";
import {verifyAuthHeader} from "../utils/auth";
import {shopMe} from "../controller/shop";

export const shop = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
      case "/":
        if (req.method === "GET") {
          req = await verifyAuthHeader(req, res);
          await shopMe(req, res);
          return;
        }
        break;
      case "/pointticket":
        if (req.method === "GET") {
          req = await verifyAuthHeader(req, res);
          await getPointTicketPrice(req, res);
          return;
        } else if (req.method === "POST") {
          req = await verifyAuthHeader(req, res);
          await usePointTicket(req, res);
          return;
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

      res.statusCode = 404;
      res.statusMessage = "Not found";
      res.send();
    });
  });
