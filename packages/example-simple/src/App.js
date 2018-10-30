import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.scoped.css';
import Link from './Link';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Link
            className={styles['App-link']}
            to="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </Link>
        </header>
      </div>
    );
  }
}

export default App;
