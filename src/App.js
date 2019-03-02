import React, { Component } from 'react';
import styles from './styles.scss';

class App extends Component {
  render() {
    return (
      <main className="app">
        <div className='container'>
          <h1>Hello World!</h1>

          <div className={styles.xbar}>
            <div className={styles.xbarGroup}>
              <div className={styles.slot}> 1</div>
              <div className={styles.slot}> 2</div>
              <div className={styles.slot}> 3</div>
              <div className={styles.slot}> 4</div>
            </div>

            <div className={styles.xbarGroup}>
              <div className={styles.slot}> 1</div>
              <div className={styles.slot}> 2</div>
              <div className={styles.slot}> 3</div>
              <div className={styles.slot}> 4</div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
