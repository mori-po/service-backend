import * as admin from "firebase-admin";
admin.initializeApp();

export * from "./routes/pointVoucher";
export * from "./routes/user";
export * from "./routes/pointTicket";
export * from "./routes/shop";
export * from "./routes/admin";
