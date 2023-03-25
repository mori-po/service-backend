import {Request, Response} from "firebase-functions/v1";
import {ExtendRequest} from "../../types/http";
import * as admin from "firebase-admin";

const firestore = admin.firestore();

export const getMe = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentUser) {
      res.sendStatus(403);
      return;
    }
    const user = (
      await firestore.collection("users").doc(req.currentUser.sub).get()
    ).data();

    if (!user) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (error) {
    res.sendStatus(403);
  }
  return;
};

export const signupUser = async (req: ExtendRequest, res: Response) => {
  try {
    if (!req.currentUser) {
      res.sendStatus(403);
      return;
    }
    const users = firestore.collection("users");
    await users.doc(req.currentUser.sub).set({name: req.currentUser.name});
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(403);
  }
  return;
};

export const deleteUser = async (req: Request, res: Response) => {
  res.json({});
  return;
};
