import React, { Component } from 'react';

import Slot from './slot';
import Action from './action';
import styles from './styles.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bars: {
        primary: {
          left: [
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4}
          ],
          right: [
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4}
          ]
        },
        secondary: {
          left: [
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4}
          ],
          right: [
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4}
          ]
        },
        tertiary: {
          left: [
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4}
          ],
          right: [
            {name: 1},
            {name: 2},
            {name: 3},
            {name: 4}
          ]
        }
      }
    };
  }

  render() {  
    const { bars } = this.state;

    const Xbar = ({bar, id}) => {
      return(
        <div className={styles.xbar}>
          {Object.keys(bar).map((group) => {
            return (
              <Group 
                slots={bar[group]} 
                key={`${id}-${group}`} 
                id={`${id}-${group}`}  
              />
            )
          })}
        </div>
      )
    }

    const Group = ({slots, id}) => {
      return(
        <div className={styles.xbarGroup} key={`${id}`}>
          {slots.map((slot, index) => {
            return (
              <Slot 
                key={`${id}-slot-${index + 1}`} 
                value={slot}
              />
            )
          })}
        </div>
      )
    }

    return (
      <main className="app">
        <div className='container'>
          <h1>Hello World!</h1>

          <div className='panel'>
            {Object.keys(bars).map((bar) => {
              return (
                <Xbar 
                  bar={bars[bar]} 
                  key={bar} 
                  id={bar} 
                />
              )
            })}
          </div>
          
          <div className='actions'>
            <Action />
          </div>
        </div>
      </main>
    );
  }
}

export default App;
