import * as functions from "firebase-functions";
import {cors} from "../utils/cors";
import {getTicketSupplyUsedValueByVoucherId} from "../controller/admin";
import {errorTypes} from "../utils/errorHandling";

export const admin = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
      case "/get-ticketsupplyusedvalue-gG9rhPY3QF6J9sQC":
        if (req.method === "GET") {
          await getTicketSupplyUsedValueByVoucherId(req, res);
          return;
        }
        break;
      default:
        break;
      }

      res.status(405).send(errorTypes[405]);
    });
  });
