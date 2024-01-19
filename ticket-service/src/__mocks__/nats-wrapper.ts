export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((_1: string, _2: string, callback: () => void) => {
        callback();
      }),
  },
};
