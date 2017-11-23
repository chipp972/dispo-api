// @flow
import React from 'react';
import { List, ListItem, ListItemText } from 'material-ui';
import type { CompanyType } from '../../../../src/api/companytype/companytype.type.js';

type CompanyTypeListProps = {
  companyTypes: CompanyType[]
};

const CompanyTypeList = (props: CompanyTypeListProps) => (
  <List>
    {props.companyTypes.map((companyType) => (
      <ListItem button key={companyType._id}>
        <ListItemText primary={companyType.name} />
      </ListItem>
    ))}
  </List>
);

export default CompanyTypeList;
