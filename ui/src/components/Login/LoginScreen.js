// @flow
import React from 'react';
import type { AdminLogin } from '../../api/api.type';
import AuthForm from './AuthForm';
import LoginForm from './LoginForm';

type LoginScreenProps = {
  adminLogin: AdminLogin,
  handleError: (err: any) => any
};

type LoginScreenState = {
  isEmailSent: boolean,
  email: string,
  code: string
};

export default class LoginScreen extends React.Component<
  LoginScreenProps,
  LoginScreenState
> {
  constructor(props: LoginScreenProps) {
    super(props);
    this.state = {
      isEmailSent: false,
      email: '',
      code: ''
    };
  }

  handleEmailSent = (email: string) => {
    console.log(email);
    this.setState({ isEmailSent: true, email });
  };

  handleError = (res: any) => console.log(res);

  render() {
    return this.state.isEmailSent ? (
      <AuthForm
        {...this.props}
        email={this.state.email}
        handleError={this.handleError}
      />
    ) : (
      <LoginForm
        {...this.props}
        handleEmailSent={this.handleEmailSent}
        handleError={this.handleError}
      />
    );
  }
}
