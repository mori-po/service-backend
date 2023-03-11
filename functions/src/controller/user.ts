import {Request, Response} from "firebase-functions/v1";

export const getMe = async (req: Request, res: Response) => {
  res.json({id: 0, name: "taro"});
  return;
};

export const signupUser = async (req: Request, res: Response) => {
  res.json({});
  return;
};

export const deleteUser = async (req: Request, res: Response) => {
  res.json({});
  return;
};
