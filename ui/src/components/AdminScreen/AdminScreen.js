// @flow
import React from 'react';
import AdminMenu from '../AdminMenu/AdminMenu';
import {
  companyOperations,
  companyTypeOperations,
  userOperations
} from '../../api/api';

const apiOperations = {
  companyOperations,
  companyTypeOperations,
  userOperations
};

const AdminScreen = () => <AdminMenu {...apiOperations} />;

export default AdminScreen;
