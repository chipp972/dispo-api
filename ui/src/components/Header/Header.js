// @flow
import React from 'react';
import { AppBar, Typography } from 'material-ui';
import { Link } from 'react-router-dom';

export const Header = () => (
  <AppBar position="static" style={{ padding: 20 }}>
    <Typography type="title" color="inherit">
      Dispo administration panel
    </Typography>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/login'>Login</Link></li>
      </ul>
    </nav>
  </AppBar>
);
