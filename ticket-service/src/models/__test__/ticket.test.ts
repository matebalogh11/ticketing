import { Ticket } from '../ticket';
import { MongooseError } from 'mongoose';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'music',
    price: 5,
    userId: '123',
  });

  const { id } = await ticket.save();

  const firstFetch = await Ticket.findById(id);
  firstFetch!.set({ title: 'audio' });

  const secondFetch = await Ticket.findById(id);
  secondFetch!.set({ title: 'video' });

  await firstFetch!.save();
  try {
    await secondFetch!.save();
  } catch (error) {
    expect(error).toBeInstanceOf(MongooseError);
  }
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'music',
    price: 5,
    userId: '123',
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
