import { OrderCancelledEvent, Publisher, Subjects } from '@ticketchef/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
