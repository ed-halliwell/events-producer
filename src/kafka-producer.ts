import { Kafka, Partitioners, Producer } from "kafkajs";

export class KafkaProducer {
  private clientId: string;

  private topicName: string;

  private producer: Producer;

  constructor(clientId: string, topicName: string) {
    this.clientId = clientId;
    this.topicName = topicName;
    this.producer = this.#createProducer();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      console.log("Error connecting the producer: ", error);
    }
  }

  async sendMessage(msg: string): Promise<void> {
    await this.producer.send({
      topic: this.topicName,
      messages: [{ value: msg }],
    });
  }

  async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  #createProducer(): Producer {
    const kafka = new Kafka({
      clientId: this.clientId,
      brokers: ["kafka:9092"],
    });

    return kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }
}
