import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return (
    <p className="h2">{`You are ${currentUser ? '' : 'NOT'} signed in`}</p>
  );
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/currentUser');
  return data;
};

export default LandingPage;
