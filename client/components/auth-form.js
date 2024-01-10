import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/use-request';

const AuthForm = ({ apiUrl, redirectPath, label }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest(
    apiUrl,
    'post',
    {
      email,
      password,
    },
    () => Router.push(redirectPath)
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{label}</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        {label}
      </button>
    </form>
  );
};

export default AuthForm;
