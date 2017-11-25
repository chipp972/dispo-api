import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import io from 'socket.io-client';
import env from './env';
import {
  companyOperations,
  companyTypeOperations,
  userOperations,
} from './api/api';
import { adminLogin } from './api/auth';

ReactDOM.render(
  <App
    socket={io(env.api.websocketUrl)}
    {...{
      companyOperations,
      companyTypeOperations,
      userOperations,
      adminLogin,
    }}
  />,
  document.getElementById('root')
);
registerServiceWorker();
