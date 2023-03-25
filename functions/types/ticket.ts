import {Voucher} from "./voucher";

export type Ticket = {
  id: string
  user_id: string
  amount: number
  usedAt: number | null
  pointVoucher_id: string
  pointVoucher: Voucher
}
