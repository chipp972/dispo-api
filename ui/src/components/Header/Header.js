// @flow
import React from 'react';
import { AppBar, Typography, Toolbar, Button } from 'material-ui';
import { Link } from 'react-router-dom';
import ExitToApp from 'material-ui-icons/ExitToApp';

type HeaderProps = {
  isAuthenticated: boolean
};

export const Header = (props: HeaderProps) => (
  <AppBar position="static" style={{ padding: 20 }}>
    <Toolbar>
      <Typography type="title" color="inherit">
        {"Dispo Panneau d'administration"}
      </Typography>
      {props.isAuthenticated && (
        <Button color="contrast">
          <Link to="/logout">
            <ExitToApp />
          </Link>
        </Button>
      )}
    </Toolbar>
  </AppBar>
);
