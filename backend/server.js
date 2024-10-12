import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./db/dbConnect.js";
import { app } from "./app.js";
import path from "path";
import express from "express";

const port = process.env.PORT;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
dbConnect()
  .then(
    app.listen(port || 4000, () => {
      console.log(`server connected on port | ${port}`);
    })
  )
  .catch((error) => console.log("Failed to connect the server ", error));
