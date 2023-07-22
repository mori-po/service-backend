import * as admin from "firebase-admin";
import {shops, tickets, vouchers, users} from "./sampleData";

process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
process.env["FIREBASE_AUTH_EMULATOR_HOST"]="localhost:9099";

admin.initializeApp({
  projectId: "moripo-service-backend",
});
const firestore = admin.firestore();
const auth = admin.auth();

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

const createUser = async () => {
  for (const user of users) {
    await auth.createUser(user)
    .then(async (userRecord) => {
      console.log('Successfully created new user:', userRecord.uid);
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    });
  }
};

const importAll = async () => {
  console.log(admin.apps[0]?.firestore());
  createUser();
  importShop();
  importVoucher();
  importTicket();
};

importAll();
