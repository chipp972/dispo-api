// @flow
import React from 'react';
import Form from '../Form/Form';
import type { AuthResponse } from '../../../../src/api/auth/auth.type';
import type { AdminLogin } from '../../api/api.type';

type AuthFormProps = {
  email: string,
  adminLogin: AdminLogin,
  handleError: (err: any) => any,
  handleLogin: (AuthResponse) => any,
  // refreshToken: (token: string) => any
};

const AuthForm = (props: AuthFormProps) => (
  <Form
    initialState={{
      email: props.email,
      code: ''
    }}
    inputs={[
      { id: 'email', label: 'Email', type: 'text', disabled: true },
      { id: 'code', label: 'Code', type: 'text' }
    ]}
    onSubmit={({ email, code }) => {
      props.adminLogin
        .authenticate(email, code)
        .then((res: AuthResponse) => props.handleLogin(res))
        .catch((err) => props.handleError(err));
    }}
    onSubmitLabel="S'authentifier"
  />
);

export default AuthForm;
