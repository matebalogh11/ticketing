import AuthForm from '../../components/auth-form';

const SignIn = () => {
  return (
    <AuthForm apiUrl="/api/users/signin" label="Sign In" redirectPath="/" />
  );
};

export default SignIn;
