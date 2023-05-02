import * as admin from "firebase-admin";
import {shops, tickets, vouchers} from "./sampleData";

process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";

admin.initializeApp({
  projectId: "moripo-service-backend",
});
const firestore = admin.firestore();

const importShop = async () => {
  for (const shop of shops) {
    await firestore.collection("shops").doc(shop.uid).set(shop);
  }
};

const importVoucher = async () => {
  for (const voucher of vouchers) {
    await firestore.collection("pointVouchers").doc(voucher.id).set(voucher);
  }
};

const importTicket = async () => {
  for (const ticket of tickets) {
    await firestore.collection("pointTickets").doc(ticket.id).set(ticket);
  }
};

const importAll = async () => {
  console.log(admin.apps[0]?.firestore());
  await importShop();
  await importVoucher();
  await importTicket();
};

importAll();
