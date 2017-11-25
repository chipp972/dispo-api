// @flow
import React from 'react';
import Form from '../Form/Form';
import type { AdminLogin } from '../../api/api.type';
import {setToken, setTokenId} from '../../api/storage';

type AuthFormProps = {
  handleError: (err: any) => any,
  email: string,
  adminLogin: AdminLogin
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
        .then((res) => {
          console.log(res);
          setToken(res.token);
          setTokenId(res.tokenId);
        })
        .catch((err) => props.handleError(err));
    }}
    onSubmitLabel="S'authentifier"
  />
);

export default AuthForm;
