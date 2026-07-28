import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from "./routes/chat.js";

//create express app ..and define port
const app = express();
const PORT = process.env.PORT || 8080;

//global middlewares
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
}));

//routes
app.use("/api" , chatRouter);


// connection with db
const dbUrl = process.env.MONGODB_URL;
main()
  .then(() => {
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}


