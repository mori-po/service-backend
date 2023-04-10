import * as admin from "firebase-admin";
import {Response} from "firebase-functions/v1";
import axios from "axios";
import {ExtendRequest, LineVerifiedData} from "../../types/http";

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
    } catch (error) {
      res.sendStatus(503);
      throw new Error("");
    }
  } else if (firebaseAuthToken) {
    try {
      const data: any = await auth.verifyIdToken(String(firebaseAuthToken));
      req.currentShop = data;
    } catch (error) {
      res.sendStatus(503);
      throw new Error("");
    }
  }

  return req;
};
