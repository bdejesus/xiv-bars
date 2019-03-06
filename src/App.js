import React, { Component } from 'react';

import Xbar from './Xbar';
import Action from './Action';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '85fb06d1e4e94cf0bee73acf',
      selectedAction: null,
      bars: {
        primary: {
          left: [
            { name: 1 },
            { name: 2 },
            { name: 3 },
            { name: 4 }
          ],
          right: [
            { name: 1 },
            { name: 2 },
            { name: 3 },
            { name: 4 }
          ]
        }
      }
    };
  }

  handleDrag(action) {
    this.setState({
      selectedAction: action
    })
  }

  getAction() {
    fetch (`https://xivapi.com/ClassJobCategory?key=${this.state.key}`, { mode: 'cors' })
      .then(response => response.json())
      .then(data => console.info(data.Results))
  }

  render() {  
    const { bars, selectedAction } = this.state;

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
                  selectedAction={selectedAction}
                />
              )
            })}
          </div>
          
          <div className='actions'>
            <Action 
              action={ {name: 'C'} } 
              dragged={(action) => { this.handleDrag(action) }}
            />

            {this.getAction()}
          </div>
        </div>
      </main>
    );
  }
}

export default App;
