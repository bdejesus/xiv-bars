/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import XIVAPI from 'xivapi-js';
import Xbar from './components/Xbar';
import Action from './components/Action';
import JobSelect from './components/JobSelect';
import styles from './styles.scss';

const mapStateToProps = state => ({ bars: state.bars });

class App extends Component {
  constructor(props) {
    super(props);
    const apiKey = '85fb06d1e4e94cf0bee73acf';
    this.state = {
      api: new XIVAPI(apiKey),
      jobs: [],
      actions: [],
      selectedJob: { Name: '', ID: 1 }
    };
  }

  componentDidMount() {
    this.fetchJobsList();
    this.fetchActions();
  }

  updateView(event) {
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
      actions
    } = this.state;

    const ActionsList = actions.map(action => (
      <li key={`action-${action.ID}`}>
        <Action
          action={action}
          dragged={(draggedAction) => { this.handleDrag(draggedAction); }}
        />
      </li>
    ));

    return (
      <main className="app">
        <div className="container">
          <div className="panel">
            {Object.keys(bars).map(xBar => (
              <Xbar key={xBar} id={xBar} bar={bars[xBar]} />
            ))}
          </div>

          <div className="actions">
            <JobSelect
              jobs={jobs}
              updateJob={event => this.updateJob(event)}
            />

            <div className={styles.panel}>
              <h3>Actions</h3>
              <ul className={styles.listActions}>
                { actions && ActionsList }
              </ul>
            </div>

          </div>
        </div>
      </main>
    );
  }
}

App.propTypes = {
  bars: PropTypes.shape().isRequired
};

export default connect(mapStateToProps)(App);
