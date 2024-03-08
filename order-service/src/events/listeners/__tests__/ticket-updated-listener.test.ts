import { TicketUpdatedEvent } from '@ticketchef/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: generateMongooseId(),
    title: 'concert',
    price: 200,
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'concert2',
    version: ticket.version + 1,
    userId: generateMongooseId(),
    price: 300,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('finds updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it('throws error if event version is out of order', async () => {
  const { listener, data, msg } = await setup();
  data.version++;

  try {
    await listener.onMessage(data, msg);
  } catch (error: any) {
    expect(error.message).toEqual(
      `No document found for query \"{ _id: new ObjectId('${data.id}'), version: 1 }\" on model \"Ticket\"`
    );
  }
});
