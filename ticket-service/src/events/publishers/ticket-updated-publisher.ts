import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketchef/common';

/**
 * @extends Publisher
 * @implements {Publisher}
 */
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
