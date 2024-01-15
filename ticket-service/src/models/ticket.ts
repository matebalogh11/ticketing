import mongoose from 'mongoose';

// An inteface that describes the properties that are required to create a new Ticket
interface TicketAtrrs {
  title: string;
  price: string;
  userId: string;
}

// An interface that describes the properties that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  userId: string;
}

// An interface that describes ther properties that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAtrrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;
      },
      versionKey: false,
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAtrrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
