import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { MessageQueue } from "./src/message-queue";
import { getHome } from "./src/controllers/home";

dotenv.config();

const port = process.env.PORT;
const queueName = process.env.QUEUE_NAME ?? "";
const queueUrl = process.env.QUEUE_URL ?? "";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const messageQueue = new MessageQueue(queueName, queueUrl);

async function connectToQueue() {
  await messageQueue.connect();
  console.log("Queue connected successfully");
}

connectToQueue();

interface Log {
  sentAt: Date;
  message: string;
}

app.post("/", (req: Request, res: Response) => {
  const { message } = req.body;

  const log: Log = {
    sentAt: new Date(Date.now()),
    message,
  };

  console.log("Firing event... ", log);
  messageQueue.sendMessage(JSON.stringify(log));

  return res.redirect("/");
});

app.get("/", getHome);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
