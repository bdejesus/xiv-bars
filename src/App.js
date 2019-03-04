import React, { Component } from 'react';

import Xbar from './Xbar';
import Action from './Action';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bars: {
        primary: {
          left: {
            bottom: {
              name: 1
            },
            left: {
              name: 2
            },
            top: {
              name: 3
            },
            right: {
              name: 4
            }
          },
          right: {
            bottom: {
              name: 1
            },
            left: {
              name: 2
            },
            top: {
              name: 3
            },
            right: {
              name: 4
            }
          }
        }
      }
    };
  }

  updateSlot(e) {
    console.log(this);
    this.setState({ 
      bars: {
        primary: {
          left: [
            { name: 2 }
          ]
        } 
      }
    })
  }

  render() {  
    const { bars } = this.state;

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
