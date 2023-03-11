import * as functions from "firebase-functions";
import {cors} from "../utils/cors";
import {deleteUser, getMe, signupUser} from "../controller/user";

export const user = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.path) {
      case "/":
        if (req.method === "POST") {
          await signupUser(req, res);
          return;
        } else if (req.method === "DELETE") {
          await deleteUser(req, res);
          return;
        }
        break;
      case "/me":
        if (req.method === "GET") {
          await getMe(req, res);
          return;
        }
      }

      res.statusCode = 404;
      res.statusMessage = "Not found";
      res.send();
    });
  });
