import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import { Fragment } from 'react';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Fragment>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </Fragment>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get(
    '/api/users/currentUser'
  );
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
