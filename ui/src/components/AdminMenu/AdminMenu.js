// @flow
import React from 'react';
import { Tabs, Tab } from 'material-ui';
import BuisinessIcon from 'material-ui-icons/Business';
import GroupWorkIcon from 'material-ui-icons/GroupWork';
import FaceIcon from 'material-ui-icons/Face';
import SwipeableViews from 'react-swipeable-views';

import TabContainer from '../TabContainer/TabContainer';
import AdminBuisnessTab from './AdminBuisnessTab/AdminBuisnessTab';
import CompanyTypeForm from './CompanyTypeForm';
import UserForm from './UserForm';

type AdminMenuProps = {
  companyOperations: any,
  companyTypeOperations: any,
  userOperations: any
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
          indicatorColor="primqry"
          textColor="primary"
        >
          <Tab icon={<GroupWorkIcon />} label="GENERAL" />
          <Tab icon={<FaceIcon />} label="USER" />
          <Tab icon={<BuisinessIcon />} label="COMPANY" />
        </Tabs>
        <SwipeableViews
          axis={'ltr' === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir="ltr">
            <CompanyTypeForm {...this.props} />
          </TabContainer>
          <TabContainer dir="ltr">
            <UserForm {...this.props} />
          </TabContainer>
          <TabContainer dir="ltr">
            <AdminBuisnessTab {...this.props} />
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}
