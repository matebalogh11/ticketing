import axios from 'axios';

const buildClient = ({ req }) => {
  // SSR
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://ingress-srv',
      headers: req.headers,
    });
  } else {
    // client side
    return axios.create();
  }
};

export default buildClient;
