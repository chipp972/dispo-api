// @flow
import React from 'react';
import { AppBar, Typography } from 'material-ui';
import { SocketIO } from 'socket.io-client';
import AdminScren from '../AdminScreen/AdminScreen';
import './App.css';

type AppProps = {
  socket: SocketIO.Socket
};

const App = (props: AppProps) => (
  <div style={{ textAlign: 'center' }}>
    <AppBar position="static" style={{ padding: 20 }}>
      <Typography type="title" color="inherit">
        Dispo administration panel
      </Typography>
    </AppBar>
    <AdminScren />
  </div>
);

export default App;
