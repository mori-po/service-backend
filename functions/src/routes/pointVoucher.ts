import * as functions from "firebase-functions";
import {cors} from "../utils/cors";
import {earnPointTicket, findPointVaucher} from "../controller/pointVoucher";
import {verifyAuthHeader} from "../utils/auth";

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
      }
      res.statusCode = 404;
      res.statusMessage = "Not found";
      res.send();
    });
  });
