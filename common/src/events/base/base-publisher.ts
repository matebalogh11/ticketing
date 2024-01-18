import { Stan } from 'node-nats-streaming';
import { Subjects } from '../subjects';

type Event = {
  subject: Subjects;
  data: any;
};

/**
 * Publisher base class. Should extend specific publisher classes.
 * @template T - The type that extends the specified interface.
 * @extends {Event}
 * @property {Subjects} subject - The subject of the event.
 * @property {any} data - Any data associated with the event.
 * @constructor
 * @param {Stan} client - The NATS Streaming client.
 */
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];

  constructor(private client: Stan) {}

  async publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        console.log(`Event published to subject: ${this.subject}`);
        resolve();
      });
    });
  }
}
