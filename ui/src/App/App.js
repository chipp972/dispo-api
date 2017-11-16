import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AdminScreen from '../AdminScreen/AdminScreen';
import io from 'socket.io-client';

const url =
  process.env.NODE_ENV === 'production' ? '/' : process.env.REACT_APP_PROXY;
const socket = io(url);

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <AdminScreen socket={socket} />
      </div>
    );
  }
}
