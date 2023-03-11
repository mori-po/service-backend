import {Request, Response} from "firebase-functions/v1";

export const findPointVaucher = async (req: Request, res: Response) => {
  res.json({
    id: 1,
    event_name: "ゴミ拾い",
    event_description: "みんなでゴミ拾いをしよう！\nみんなで楽しもう！",
    event_image:
      "https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png",
    location: "35.680885, 139.769252",
    location_name: "東京駅",
    point_amount: 100,
    max_supply: 100,
    max_receivable_tickets: 2,
    event_date: 1677423600,
    expired_at: 1680274800,
  });
};

export const earnPointTicket = async (req: Request, res: Response) => {
  res.json({});
};
