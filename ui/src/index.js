import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import io from 'socket.io-client';
import env from './env';

ReactDOM.render(
  <App socket={io(env.api.websocketUrl)} />,
  document.getElementById('root')
);
registerServiceWorker();
