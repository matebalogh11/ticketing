import { OrderCreatedEvent, Publisher, Subjects } from '@ticketchef/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
