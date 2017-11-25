// @flow
import React from 'react';
import { AppBar, Typography } from 'material-ui';
import { SocketIO } from 'socket.io-client';
import AdminScren from '../AdminScreen/AdminScreen';
import LoginScreen from '../Login/LoginScreen';
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

type AppProps = {
  socket: SocketIO.Socket,
  companyOperations: CrudOperations<CompanyData, Company>,
  companyTypeOperations: CrudOperations<CompanyTypeData, CompanyType>,
  userOperations: CrudOperations<UserData, User>,
  adminLogin: AdminLogin,
};

type AppState = {
  companies: Company[],
  companyTypes: CompanyType[],
  users: User[]
};

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
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

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <AppBar position="static" style={{ padding: 20 }}>
          <Typography type="title" color="inherit">
            Dispo administration panel
          </Typography>
        </AppBar>
        <LoginScreen adminLogin={this.props.adminLogin} handleError={(err) => console.log(err)} />
        <AdminScren
          {...this.state}
          {...this.props}
          usersRefresh={this.handleUserRefresh}
          companyTypesRefresh={this.handleCompanyTypesRefresh}
          companiesRefresh={this.handleCompaniesRefresh}
        />
      </div>
    );
  }
}
