// @flow
import React from 'react';
import {List, ListItem, Avatar, ListItemText } from 'material-ui';
import type { Company } from '../../../../src/api/company/company.type.js';

type CompanyListProps = {
  companies: Company[]
};

const CompanyList = (props: CompanyListProps) => (
  <List>
    {props.companies.map((company) => (
      <ListItem button key={company._id}>
        <Avatar><img src={company.imageUrl} alt={company.name} /></Avatar>
        <ListItemText primary={company.name} secondary={company.address}/>
      </ListItem>
    ))}
  </List>
);

export default CompanyList;
