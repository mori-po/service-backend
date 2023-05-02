import {Shop} from "../types/shop";
import {Ticket} from "../types/ticket";
import {Voucher} from "../types/voucher";

export const shops: Shop[] = [
  {
    uid: "1",
    name: "Shop 1",
    active: true,
  },
  {
    uid: "2",
    name: "Shop 2",
    active: true,
  },
  {
    uid: "3",
    name: "Shop 3",
    active: false,
  },
];

export const vouchers: Voucher[] = [
  {
    id: "1",
    event_name: "Event 1",
    event_description: "Event 1 Description",
    event_date: 1704067200,
    event_image: "https://picsum.photos/200/300",
    location_name: "Location 1",
    location: "Location 1",
    max_supply: 100,
    max_receivable_tickets: 1,
    point_amount: 100,
    expired_at: 1704067200,
  },
  {
    id: "2",
    event_name: "Event 2",
    event_description: "Event 2 Description",
    event_date: 1585699200,
    event_image: "https://picsum.photos/200/300",
    location_name: "Location 2",
    location: "Location 2",
    max_supply: 100,
    max_receivable_tickets: 1,
    point_amount: 100,
    expired_at: 1585699200,
  },
];

export const tickets: Ticket[] = [
  {
    id: "1",
    user_id: "1",
    pointVoucher_id: "1",
    pointVoucher: {
      id: "1",
      event_name: "Event 1",
      event_description: "Event 1 Description",
      event_date: 1704067200,
      event_image: "https://picsum.photos/200/300",
      location_name: "Location 1",
      location: "Location 1",
      max_supply: 100,
      max_receivable_tickets: 1,
      point_amount: 100,
      expired_at: 1704067200,
    },
    shop_id: "1",
    amount: 100,
    used_at: 1704067200,
  },
  {
    id: "2",
    user_id: "1",
    pointVoucher_id: "1",
    pointVoucher: {
      id: "1",
      event_name: "Event 1",
      event_description: "Event 1 Description",
      event_date: 1704067200,
      event_image: "https://picsum.photos/200/300",
      location_name: "Location 1",
      location: "Location 1",
      max_supply: 100,
      max_receivable_tickets: 1,
      point_amount: 100,
      expired_at: 1704067200,
    },
    shop_id: null,
    amount: 100,
    used_at: null,
  },
];
