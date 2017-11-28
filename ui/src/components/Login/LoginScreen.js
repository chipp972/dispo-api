// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import type { AdminLogin } from '../../api/api.type';
import AuthForm from './AuthForm';
import LoginForm from './LoginForm';
import type { AuthResponse } from '../../../../src/api/auth/auth.type';

type LoginScreenProps = {
  isAuthenticated: boolean,
  adminLogin: AdminLogin,
  handleError: (err: any) => any,
  handleAuthenticate: (AuthResponse) => any
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
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    } else if (this.state.isEmailSent) {
      return (
        <AuthForm
          adminLogin={this.props.adminLogin}
          email={this.state.email}
          handleError={this.handleError}
          handleLogin={this.props.handleAuthenticate}
        />
      );
    } else {
      return (
        <LoginForm
          adminLogin={this.props.adminLogin}
          handleEmailSent={this.handleEmailSent}
          handleError={this.handleError}
        />
      );
    }
  }
}
