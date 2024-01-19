export enum OrderStatus {
  /**
   * Order has been created but the ticket has not been reserved
   */
  Created = 'created',
  /**
   * The ticket the order trying to reserve has already been reserved, or when its cancelled,
   * or the order expires before payment
   */
  Cancelled = 'cancelled',
  /**
   * The order has successfully reserved the ticket
   */
  AwaitingPayment = 'awaitingPayment',
  /**
   * Anytime the order has reserved the ticket and the user has provided payment
   */
  Complete = 'complete',
}
