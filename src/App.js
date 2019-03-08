import React, { Component } from 'react';
import XIVAPI from 'xivapi-js';
import styles from './styles.scss';
import Xbar from './Xbar';
import Item from './Item';
import Text from './utils/text';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '85fb06d1e4e94cf0bee73acf',
      selectedAction: null,
      selectedJob: 2,
      actions: [],
      jobs: [],
      bars: {
        primary: {
          left: [
            { Name: 1 },
            { Name: 2 },
            { Name: 3 },
            { Name: 4 }
          ],
          right: [
            { Name: 1 },
            { Name: 2 },
            { Name: 3 },
            { Name: 4 }
          ]
        }
      }
    };
    this.api = new XIVAPI(this.state.key)
  }

  handleDrag(action) {
    this.setState({
      selectedAction: action
    })
  }

  componentWillMount() {
    this.setState({ api: new XIVAPI(this.state.key) })
    this.getContent()
  }

  componentDidMount() { 
  }

  async getContent() {
    const api = this.api.data;

    // Get Jobs List
    let jobs = await api.list('ClassJob');
    jobs = await jobs.Results;
    
    // Get Selectd Job Actions
    let selectedJob = await jobs[22] // TODO: Make this dynamic
    let actions = await this.api.search('',  { filters: `ClassJob.ID=${selectedJob.ID}` });
    actions = await actions.Results;
    
    this.setState({ jobs, actions });
  }

  render() {
    const { bars, selectedAction } = this.state;

    const actionsList =
      this.state.actions.map((action) => {
        return (
          <li key={`action-${action.ID}`}>
            <Item
              action={action}
              dragged={(action) => { this.handleDrag(action) }}
            />
          </li>
        )
      })

    let jobsList = []
    if (this.state.jobs) {
      jobsList = this.state.jobs.map((job,index) => {
        return (
          <option key={index} value={job.ID}>{Text.titleize(job.Name)}</option>
        )
      })
    }

    return (
      <main className="app">
        <div className='container'>
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
            <h2>Job</h2>
            <p>GLA</p>

            <form>
              <select name='jobSelect' id='jobSelect'>
                { jobsList }
              </select>
            </form>

            <h3>Actions</h3>
            <ul className={styles.listActions}>
              { this.state.actions && actionsList }
            </ul>

          </div>
        </div>
      </main>
    );
  }
}

export default App;
