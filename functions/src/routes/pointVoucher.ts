import * as functions from "firebase-functions";
import {cors} from "../utils/cors";
import {
  earnPointTicket,
  findPointVaucher,
  mockPointVoucher,
} from "../controller/pointVoucher";
import {verifyAuthHeader} from "../utils/auth";
import {errorTypes} from "../utils/errorHandling";

export const pointvoucher = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
      case "/":
        if (req.method === "GET") {
          await findPointVaucher(req, res);
        } else if (req.method === "POST") {
          req = await verifyAuthHeader(req, res);
          await earnPointTicket(req, res);
        }
        break;
      case "/mockdata":
        if (req.method === "GET") {
          await mockPointVoucher(req, res);
        }
        break;
      default:
        break;
      }

      res.status(405).send(errorTypes[405]);
    });
  });
