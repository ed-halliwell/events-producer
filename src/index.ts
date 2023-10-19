import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { MyRabbitMqProducer } from "./rabbit-message-queue";
import { getHome } from "./controllers/home";
import { MyKafkaProducer } from "./kafka-producer";

dotenv.config();

const port = process.env.PORT;
const queueName = process.env.QUEUE_NAME ?? "";
const queueUrl = process.env.QUEUE_URL ?? "";
const kafkaClientId = process.env.KAFKA_CLIENT_ID ?? "";
const kafkaTopicName = process.env.KAFKA_TOPIC_NAME ?? "";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RABBIT MQ
const messageQueue = new MyRabbitMqProducer(queueName, queueUrl);

async function connectToRabbitQueue() {
  await messageQueue.connect();
  console.log("RabbitMQ connected successfully");
}
connectToRabbitQueue();

// KAFKA
const kafka = new MyKafkaProducer(kafkaClientId, kafkaTopicName);

async function connectToKafka() {
  await kafka.connect();
  console.log("Kafka connected successfully", {
    kafkaClientId,
    kafkaTopicName,
  });
}
connectToKafka();

interface Log {
  sentAt: Date;
  message: string;
}

app.post("/", (req: Request, res: Response) => {
  const { message } = req.body;

  const log: Log = { sentAt: new Date(Date.now()), message };

  console.log("Firing event... ", log);
  messageQueue.sendMessage(JSON.stringify(log));
  kafka.sendMessage(JSON.stringify(log));

  return res.redirect("/");
});

app.get("/", getHome);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
