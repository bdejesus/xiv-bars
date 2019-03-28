import React, { Component } from 'react';
import XIVAPI from 'xivapi-js';
import styles from './styles.scss';
import Xbar from './Xbar';
import Item from './Item';
import JobSelect from './JobSelect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
            { Name: 4 },
          ],
          right: [
            { Name: 1 },
            { Name: 2 },
            { Name: 3 },
            { Name: 4 },
          ],
        },
      },
    };
  }

  componentWillMount() {
    const key = '85fb06d1e4e94cf0bee73acf';
    this.setState({ api: new XIVAPI(key) });
  }

  componentDidMount() {
    this.fetchJobsList();
    this.fetchActions();
  }

  handleDrag(selectedAction) {
    this.setState({ selectedAction });
  }

  updateBars(event) {
    console.log(event);
    console.log(this.state);
  }

  updateJob(event) {
    const { jobs } = this.state;
    const selectedJob = jobs[event.currentTarget.value - 1];
    this.setState({ selectedJob }, (() => { this.fetchActions(); }));
  }

  async fetchJobsList() {
    const { api } = this.state;
    let jobs = await api.data.list('ClassJob');
    jobs = await jobs.Results;
    this.setState({ jobs });
  }

  async fetchActions() {
    const { api, selectedJob } = this.state;
    let actions = await api.search('', { filters: `ClassJob.ID=${selectedJob.ID}` });
    actions = await actions.Results;
    this.setState({ actions });
  }

  render() {
    const {
      bars,
      jobs,
      actions,
      selectedAction,
    } = this.state;
    const ActionsList = actions.map(action => (
      <li key={`action-${action.ID}`}>
        <Item
          action={action}
          dragged={(draggedAction) => { this.handleDrag(draggedAction); }}
        />
      </li>
    ));

    return (
      <main className="app">
        <div className="container">
          <div className="panel">
            {Object.keys(bars).map(bar => (
              <Xbar
                bar={bars[bar]}
                key={bar}
                id={bar}
                selectedAction={selectedAction}
                onUpdateXBar={event => this.updateBars(event)}
              />
            ))}
          </div>

          <div className="actions">
            <JobSelect
              jobs={jobs}
              updateJob={event => this.updateJob(event)}
            />

            <h3>Actions</h3>
            <ul className={styles.listActions}>
              { actions && ActionsList }
            </ul>

          </div>
        </div>
      </main>
    );
  }
}

export default App;
