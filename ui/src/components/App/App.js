// @flow
import React from 'react';
import { SocketIO } from 'socket.io-client';
import './App.css';
import type {
  Company,
  CompanyData
} from '../../../../src/api/company/company.type';
import type {
  CompanyType,
  CompanyTypeData
} from '../../../../src/api/companytype/companytype.type';
import type { User, UserData } from '../../../../src/api/user/user.type';
import type { CrudOperations, AdminLogin } from '../../api/api.type';
import { Header } from '../Header/Header';
import { Router } from '../Router/Router';
import {
  setToken,
  setTokenId,
  setExpireAt,
  getExpireAt,
  getToken
} from '../../api/storage';
import type { AuthResponse } from '../../../../src/api/auth/auth.type';

type AppProps = {
  socket: SocketIO.Socket,
  companyOperations: CrudOperations<CompanyData, Company>,
  companyTypeOperations: CrudOperations<CompanyTypeData, CompanyType>,
  userOperations: CrudOperations<UserData, User>,
  adminLogin: AdminLogin
};

type AppState = {
  isAuthenticated: boolean,
  companies: Company[],
  companyTypes: CompanyType[],
  users: User[]
};

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isAuthenticated: this.isLoggedIn(),
      companies: [],
      companyTypes: [],
      users: []
    };
    this.handleCompaniesRefresh();
    this.handleCompanyTypesRefresh();
    this.handleUserRefresh();
  }

  /**
   * refresh companies in state
   */
  handleCompaniesRefresh = () => {
    this.props.companyOperations
      .getAll()
      .then(
        (companies: Company[]) =>
          companies !== undefined
            ? this.setState({ companies })
            : console.log('no company')
      )
      .catch((err) => console.log(err));
  };

  handleCompanyTypesRefresh = () => {
    this.props.companyTypeOperations
      .getAll()
      .then((companyTypes: CompanyType[]) => {
        companyTypes !== undefined
          ? this.setState({ companyTypes })
          : console.log('no company type');
      })
      .catch((err) => console.log(err));
  };

  handleUserRefresh = () => {
    this.props.userOperations
      .getAll()
      .then(
        (users: User[]) =>
          users !== undefined
            ? this.setState({ users })
            : console.log('no user')
      )
      .catch((err) => console.log(err));
  };

  handleLogin = () => this.setState({
    isAuthenticated: this.isLoggedIn()
  })

  isLoggedIn = () => {
    const expireAt: Date = new Date(getExpireAt());
    const now = new Date();
    return getToken() !== undefined && expireAt.getTime() > now.getTime();
  };

  /**
   * store token informations in localstorage
   * @param {AuthResponse} authResponse
   */
  handleAuthenticate = (authResponse: AuthResponse) => {
    setToken(authResponse.token);
    setTokenId(authResponse.tokenId);
    setExpireAt(authResponse.expireAt);
    this.handleLogin();
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Header isAuthenticated={this.state.isAuthenticated} />
        <Router
          {...this.state}
          {...this.props}
          usersRefresh={this.handleUserRefresh}
          companyTypesRefresh={this.handleCompanyTypesRefresh}
          companiesRefresh={this.handleCompaniesRefresh}
          handleAuthenticate={this.handleAuthenticate}
        />
      </div>
    );
  }
}
