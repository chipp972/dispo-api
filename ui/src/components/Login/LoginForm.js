// @flow
import React from 'react';
import Form from '../Form/Form';
import type { AdminLogin } from '../../api/api.type';

type LoginFormProps = {
  adminLogin: AdminLogin,
  handleEmailSent: (email: string) => any,
  handleError: (err: any) => any
};

const LoginForm = (props: LoginFormProps) => (
  <Form
    initialState={{
      email: ''
    }}
    inputs={[{ id: 'email', label: 'Email', type: 'text' }]}
    onSubmit={({ email }) => {
      props.adminLogin
        .sendCode(email)
        .then((res) => {
          console.log(res);
          props.handleEmailSent(res.email);
        })
        .catch((err) => props.handleError(err));
    }}
    onSubmitLabel="Envoyer le code"
  />
);

export default LoginForm;
