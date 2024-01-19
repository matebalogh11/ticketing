import { Publisher, Subjects, TicketCreatedEvent } from '@ticketchef/common';

/**
 * @extends Publisher
 * @implements {Publisher}
 */
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
