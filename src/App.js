import React, { Component } from 'react';
import styles from './styles.scss';

class App extends Component {
  render() {
    return (
      <main className="App">
        <div className='container'>
          <h1>Hello World!</h1>

          <div className={styles.xbar}>
            <div className='slot'> 
              1
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
