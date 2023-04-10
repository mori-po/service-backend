import {Voucher} from "./voucher";

export type Ticket = {
  id: string
  user_id: string
  amount: number
  used_at: number | null
  shop_id: string | null
  pointVoucher_id: string
  pointVoucher: Voucher
}
