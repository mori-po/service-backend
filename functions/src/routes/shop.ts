import * as functions from "firebase-functions";
import { cors } from "../utils/cors";
import { getPointTicketPrice } from "../controller/pointTicket";
import { verifyAuthHeader } from "../utils/auth";

export const shop = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
      case "/pointticket":
        if (req.method === "GET") {
          req = await verifyAuthHeader(req, res);
          await getPointTicketPrice(req, res);
          return;
        }
      }

      res.statusCode = 404;
      res.statusMessage = "Not found";
      res.send();
    });
  });
