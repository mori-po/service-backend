import { Response } from 'firebase-functions/v1'
import { Request } from 'firebase-functions/v1/https'

export const listHoldingPointTickets = async (req: Request, res: Response) => {
  res.json([
    {
      id: 123,
      amount: 100,
      usedAt: null,
      pointvoucher_id: 1,
      pointvoucher: {
        id: 1,
        event_name: 'ゴミ拾い',
        event_description: 'みんなでゴミ拾いをしよう！\nみんなで楽しもう！',
        event_image:
          'https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png',
        location: '35.680885, 139.769252',
        location_name: '東京駅',
        point_amount: 100,
        max_supply: 100,
        max_receivable_tickets: 2,
        event_date: 1677423600,
        expired_at: 1680274800,
      },
    },
    {
      id: 123,
      amount: 100,
      used_at: null,
      pointvoucher_id: 2,
      pointvoucher: {
        id: 2,
        event_name: 'ゴミ拾い２',
        event_description:
          'みんなでたくさんゴミ拾いをしよう！\nみんなで楽しもう！',
        event_image:
          'https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png',
        location: '35.680885, 139.769252',
        location_name: '東京駅',
        point_amount: 100,
        max_supply: 100,
        max_receivable_tickets: 2,
        event_date: 1677423600,
        expired_at: 1680274800,
      },
    },
  ])
}

export const listUsedPointTicketsHistory = async (
  req: Request,
  res: Response
) => {
  // TODO: リクエストヘッダのショップ情報を使って絞り込む
  res.json([
    {
      id: 123,
      amount: 100,
      usedAt: 1677423600,
      pointvoucher_id: 1,
      pointvoucher: {
        id: 1,
        event_name: 'ゴミ拾い',
        event_description: 'みんなでゴミ拾いをしよう！\nみんなで楽しもう！',
        event_image:
          'https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png',
        location: '35.680885, 139.769252',
        location_name: '東京駅',
        point_amount: 100,
        max_supply: 100,
        max_receivable_tickets: 2,
        event_date: 1677423600,
        expired_at: 1680274800,
      },
    },
    {
      id: 123,
      amount: 100,
      used_at: 1677423600,
      pointvoucher_id: 2,
      pointvoucher: {
        id: 2,
        event_name: 'ゴミ拾い２',
        event_description:
          'みんなでたくさんゴミ拾いをしよう！\nみんなで楽しもう！',
        event_image:
          'https://4.bp.blogspot.com/--EobH7fv_OQ/VVGVEMZ0III/AAAAAAAAthI/Lgt7o2KH5QE/s400/gomihiroi_boy.png',
        location: '35.680885, 139.769252',
        location_name: '東京駅',
        point_amount: 100,
        max_supply: 100,
        max_receivable_tickets: 2,
        event_date: 1677423600,
        expired_at: 1680274800,
      },
    },
  ])
}

export const generateOnetimeNonce = async (req: Request, res: Response) => {
  res.json({ nonce: 'doaf0psadjfa81' })
}

export const getPointTicketPrice = async (req: Request, res: Response) => {
  // TODO: nonceが有効でない場合403エラー
  res.json({ price: 100 })
}
