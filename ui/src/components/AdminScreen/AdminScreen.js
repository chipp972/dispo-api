// @flow
import React from 'react';
import AdminMenu from '../AdminMenu/AdminMenu';
import CompanyList from '../AdminMenu/CompanyList';
import CompanyTypeList from '../AdminMenu/CompanyTypeList';
import UserList from '../AdminMenu/UserList';
import type {
  Company,
  CompanyData
} from '../../../../src/api/company/company.type';
import type {
  CompanyType,
  CompanyTypeData
} from '../../../../src/api/companytype/companytype.type';
import type { User, UserData } from '../../../../src/api/user/user.type';
import type { CrudOperations } from '../../api/api.type';
import { Redirect } from 'react-router-dom';

type AdminScreenProps = {
  isAuthenticated: boolean,
  companies: Company[],
  companyTypes: CompanyType[],
  users: User[],
  usersRefresh: Function,
  companiesRefresh: Function,
  companyTypesRefresh: Function,
  companyOperations: CrudOperations<CompanyData, Company>,
  companyTypeOperations: CrudOperations<CompanyTypeData, CompanyType>,
  userOperations: CrudOperations<UserData, User>
};

const AdminScreen = (props: AdminScreenProps) => {
  return props.isAuthenticated ? (
    <div>
      <AdminMenu {...props} />
      <CompanyList companies={props.companies} />
      <CompanyTypeList companyTypes={props.companyTypes} />
      <UserList users={props.users} />
    </div>
  ) : (
    <Redirect to="/login" />
  );
};

export default AdminScreen;
