import * as functions from "firebase-functions";
import {cors} from "../utils/cors";
import {
  generateOnetimeNonce,
  listHoldingPointTickets,
} from "../controller/pointTicket";
import {verifyAuthHeader} from "../utils/auth";
import {errorTypes} from "../utils/errorHandling";

export const pointticket = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
      case "/":
        if (req.method === "GET") {
          req = await verifyAuthHeader(req, res);
          await listHoldingPointTickets(req, res);
          return;
        }
        break;
      case "/onetime-nonce":
        if (req.method === "POST") {
          req = await verifyAuthHeader(req, res);
          await generateOnetimeNonce(req, res);
          return;
        }
        break;
      }
      res.status(405).send(errorTypes[405]);
    });
  });
