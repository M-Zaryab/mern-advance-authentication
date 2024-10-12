import mongoose from "mongoose";
import { db_Name } from "../constants.js";
import { app } from "../app.js";

export const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONOGODB_URI}/${db_Name}`
    );

    app.on("error", () => {
      throw new Error("Failed to connect to database");
    });
    console.log("db connected ", connectionInstance.connection.host);
  } catch (error) {
    console.log("Connection Failed with Database");
    process.exit(1);
  }
};
