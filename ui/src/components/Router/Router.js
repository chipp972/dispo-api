// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminScreen from '../AdminScreen/AdminScreen';
import LoginScreen from '../Login/LoginScreen';
import type {
  Company,
  CompanyData
} from '../../../../src/api/company/company.type';
import type {
  CompanyType,
  CompanyTypeData
} from '../../../../src/api/companytype/companytype.type';
import type { User, UserData } from '../../../../src/api/user/user.type';
import type { AuthResponse } from '../../../../src/api/auth/auth.type';
import type { CrudOperations, AdminLogin } from '../../api/api.type';

type RouterProps = {
  companies: Company[],
  companyTypes: CompanyType[],
  users: User[],
  usersRefresh: Function,
  companiesRefresh: Function,
  companyTypesRefresh: Function,
  companyOperations: CrudOperations<CompanyData, Company>,
  companyTypeOperations: CrudOperations<CompanyTypeData, CompanyType>,
  userOperations: CrudOperations<UserData, User>,
  adminLogin: AdminLogin,
  isAuthenticated: boolean,
  handleAuthenticate: (AuthResponse) => any
};

export const Router = (props: RouterProps) => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => {
        return (
          <AdminScreen
            isAuthenticated={props.isAuthenticated}
            companies={props.companies}
            companyTypes={props.companyTypes}
            users={props.users}
            usersRefresh={props.usersRefresh}
            companiesRefresh={props.companiesRefresh}
            companyTypesRefresh={props.companyTypesRefresh}
            companyOperations={props.companyOperations}
            companyTypeOperations={props.companyTypeOperations}
            userOperations={props.userOperations}
          />
        );
      }}
    />
    <Route
      path="/login"
      render={() => (
        <LoginScreen
          isAuthenticated={props.isAuthenticated}
          adminLogin={props.adminLogin}
          handleError={(err) => console.log(err)}
          handleAuthenticate={props.handleAuthenticate}
        />
      )}
    />
  </Switch>
);
