// @flow
import React from 'react';
import { Tabs, Tab } from 'material-ui';
import BuisinessIcon from 'material-ui-icons/Business';
import WorkIcon from 'material-ui-icons/Work';
import FaceIcon from 'material-ui-icons/Face';
import SwipeableViews from 'react-swipeable-views';

import TabContainer from '../TabContainer/TabContainer';
import CompanyForm from './CompanyForm';
import CompanyTypeForm from './CompanyTypeForm';
import UserForm from './UserForm';
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

type AdminMenuProps = {
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

type AdminMenuState = {
  value: number
};

export default class AdminMenu extends React.Component<
  AdminMenuProps,
  AdminMenuState
> {
  constructor(props: AdminMenuProps) {
    super(props);
    this.state = { value: 0 };
  }

  /**
   * handle changing tab
   * @param {any} event
   * @param {number} value
   * @return {void}
   */
  handleChange = (event: any, value: number) => this.setState({ value });

  /**
   * handle changing component shown when tab change
   * @param {number} index index of the tab
   * @return {void}
   */
  handleChangeIndex = (index: number) => this.setState({ value: index });

  render() {
    return (
      <div style={{ padding: 30 }}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          fullWidth
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<FaceIcon />} label="UTILISATEURS" />
          <Tab icon={<WorkIcon />} label="TYPE D'ENTREPRISE" />
          <Tab icon={<BuisinessIcon />} label="ENTREPRISE" />
        </Tabs>
        <SwipeableViews
          axis={'ltr' === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir="ltr">
            <UserForm {...this.props} />
          </TabContainer>
          <TabContainer dir="ltr">
            <CompanyTypeForm {...this.props} />
          </TabContainer>
          <TabContainer dir="ltr">
            <CompanyForm {...this.props} />
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}
