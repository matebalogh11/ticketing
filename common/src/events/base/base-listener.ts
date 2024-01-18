import { Message, Stan, SubscriptionOptions } from 'node-nats-streaming';
import { Subjects } from '../subjects';

type Event = {
  subject: Subjects;
  data: any;
};

/**
 * Listener base class. Should extend specific listener classes.
 * @template T - The type that extends the specified interface.
 * @extends {Event}
 * @property {Subjects} subject - The subject of the event.
 * @property {any} data - Any data associated with the event.
 * @constructor
 * @param {Stan} client - The NATS Streaming client.
 */
export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract onMessage(data: T['data'], msg: Message): void;
  abstract queueGroupName: string;

  protected ackWait = 5 * 10000;

  constructor(private client: Stan) {}

  get subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message receieved: ${this.subject} / ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}
