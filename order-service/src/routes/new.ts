import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@ticketchef/common';
import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router: Router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('Ticket id must be provided')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure the ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an exp date for the order
    const expDate = new Date();
    expDate.setSeconds(expDate.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expDate,
      ticket,
    });
    await order.save();

    // Publish an event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
