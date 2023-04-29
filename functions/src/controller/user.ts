import {Request, Response} from "firebase-functions/v1";
import {ExtendRequest} from "../../types/http";
import * as admin from "firebase-admin";
import {errorTypes} from "../utils/errorHandling";

const firestore = admin.firestore();

export const getMe = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).send(errorTypes[401]);
      return;
    }
    const user = (
      await firestore.collection("users").doc(req.currentUser.sub).get()
    ).data();

    if (!user) {
      res.status(404).send(errorTypes[404]);
      return;
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).send(errorTypes[500]);
  }
};

export const signupUser = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).send(errorTypes[401]);
      return;
    }
    const users = firestore.collection("users");
    await users.doc(req.currentUser.sub).set({name: req.currentUser.name});
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(errorTypes[500]);
  }
  return;
};

export const deleteUser = async (req: Request, res: Response) => {
  res.json({});
  return;
};
