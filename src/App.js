import React, { Component } from 'react';

import Xbar from './Xbar';
import Action from './Item';

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

  getClassJobs() {
    var ids = [30, 31];

    ids.map((id) => {
      var requestUri = `https://xivapi.com/ClassJobCategory/${id}`;
      fetch (`${requestUri}?key=${this.state.key}`, { mode: 'cors' })
        .then(response => response.json())
        .then((data) => {
          var jobs = data.GameContentLinks.ClassJob.ClassJobCategory
          this.setState({ [id]: jobs});
        })
    })
  }

  componentDidMount() {
    this.getClassJobs()
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
          </div>
        </div>
      </main>
    );
  }
}

export default App;
