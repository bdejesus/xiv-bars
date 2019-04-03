import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import XIVAPI from 'xivapi-js';
import initXBars from './initXBars';
import reducer from './reducers';
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
      jobs: []
    };
  }

  componentWillMount() {
    const key = '85fb06d1e4e94cf0bee73acf';
    this.setState({ api: new XIVAPI(key) });
  }

  componentDidMount() {
    this.fetchJobsList();
    this.fetchActions();

    const xbars = initXBars();
    const store = createStore(reducer, xbars);
  }

  updateView(event) {
    /* eslint-disable no-console */
    console.log(event);
    console.log(this.state);
  }

  handleDrag(selectedAction) {
    this.setState({ selectedAction });
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
    const { bars } = this.props;
    const {
      jobs,
      actions,
      selectedAction
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
                onUpdateXBar={event => this.updateView(event)}
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

App.propTypes = {
  bars: PropTypes.shape()
};

App.defaultProps = initXBars();

export default App;
