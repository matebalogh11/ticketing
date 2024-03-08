import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from '@ticketchef/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, ticket } = data;

    const result = await Ticket.findById(ticket.id);

    if (!result) {
      throw new NotFoundError();
    }

    result.set({ orderId: id });
    await result.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: result.id,
      title: result.title,
      price: result.price,
      orderId: result.orderId,
      userId: result.userId,
      version: result.version,
    });

    msg.ack();
  }
}
