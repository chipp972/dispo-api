// @flow
import React from 'react';
import { List, ListItem, ListItemText } from 'material-ui';
import type { User } from '../../../../src/api/user/user.type.js';

type CompanyTypeListProps = {
  users: User[]
};

const UserList = (props: CompanyTypeListProps) => (
  <List>
    {props.users.map((user: User) => (
      <ListItem button key={user._id}>
        <ListItemText
          primary={user.email}
          secondary={`${user.firstName} ${user.lastName}`}
        />
      </ListItem>
    ))}
  </List>
);

export default UserList;
