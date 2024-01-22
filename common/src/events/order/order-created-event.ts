import { Subjects } from '../subjects';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    expiresAt: string;
    userId: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
