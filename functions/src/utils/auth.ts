import * as admin from "firebase-admin";
import {Response} from "firebase-functions/v1";
import axios from "axios";
import {
  ExtendRequest,
  FirebaseAuthData,
  LineVerifiedData,
} from "../../types/http";
import {errorTypes} from "./errorHandling";
import {warn} from "firebase-functions/logger";

const auth = admin.auth();

export const verifyAuthHeader = async (req: ExtendRequest, res: Response) => {
  const lineToken = req.headers["line-id-token"];
  const firebaseAuthToken = req.headers["authorization"];

  if (lineToken) {
    try {
      const {data}: { data: LineVerifiedData } = await axios.post(
        "https://api.line.me/oauth2/v2.1/verify",
        {
          id_token: lineToken,
          client_id: process.env.LINE_CLIENT_ID,
        },
        {
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
        }
      );
      req.currentUser = data;
    } catch (detail) {
      res.status(403).send({...errorTypes[403], detail});
      warn(detail);
      process.exit();
    }
  } else if (firebaseAuthToken) {
    try {
      const data = (await auth.verifyIdToken(
        String(firebaseAuthToken)
      )) as FirebaseAuthData;
      req.currentShop = data;
    } catch (detail) {
      res.status(403).send({...errorTypes[403], detail});
      warn(detail);
      process.exit();
    }
  } else {
    res.status(403).send({...errorTypes[403]});
    warn("No auth header found");
    process.exit();
  }

  return req;
};
