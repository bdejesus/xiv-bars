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
      selectedJob: { Name: '', ID: 1 },
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

  updateJob(event) {
    let selectedJob = this.state.jobs[event.currentTarget.value - 1]

    this.setState({selectedJob: selectedJob});
    this.fetchData();
  }

  componentWillMount() {
    this.setState({ api: new XIVAPI(this.state.key) })
  }

  componentDidMount() { 
    this.fetchData()
  }

  async fetchData() {
    const api = this.api;

    // Get Jobs List
    let jobs = await api.data.list('ClassJob');
    jobs = await jobs.Results;
    let selectedJobID = this.state.selectedJob.ID // TODO: Make this dynamic

    // Get Selectd Job Actions
    let actions = await api.search('',  { filters: `ClassJob.ID=${selectedJobID}` });
    actions = await actions.Results;

    this.setState({ jobs, actions });
  }

  render() {
    const { bars, selectedAction } = this.state;

    let jobsList = []
    if (this.state.jobs) {
      jobsList = this.state.jobs.map((job) => {
        return (
          <option key={`job-${job.ID}`} value={job.ID}>{Text.titleize(job.Name)}</option>
        )
      })
    }

    const jobListSelect =
      <div className={styles.jobSelectWrapper}>
        <select name='jobSelect' id='jobSelect' className={styles.jobSelect} onChange={(event) => this.updateJob(event)}>
          { jobsList }
        </select>
      </div>
    
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
            { jobListSelect }
            
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
