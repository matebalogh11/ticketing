import AuthForm from '../../components/auth-form';

const SignUp = () => {
  return (
    <AuthForm
      apiUrl={'/api/users/signup'}
      label={'Sign Up'}
      redirectPath={'/'}
    />
  );
};

export default SignUp;
