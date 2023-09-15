import amqplib, { Channel } from "amqplib";

export class MessageQueue {
  private queueName: string;

  private queueUrl: string;

  private queue!: Channel;

  constructor(queueName: string, queueUrl: string) {
    this.queueName = queueName;
    this.queueUrl = queueUrl;
  }

  async connect() {
    const connection = await amqplib.connect(
      this.queueUrl ?? "amqp://localhost"
    );

    const channel = await connection.createChannel();
    channel.assertQueue(this.queueName);

    this.queue = channel;
  }

  sendMessage(msg: string) {
    this.queue.sendToQueue(this.queueName, Buffer.from(msg));
  }
}
