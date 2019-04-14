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
    const apiKey = 'deae6fc1037745eaa1c6d891f9d46a14d7e4d96fff484987a9a739d92837e3ff';
    this.state = {
      api: new XIVAPI({ private_key: apiKey }),
      jobs: [],
      actions: [],
      selectedJob: { Name: '', ID: 1 }
    };
  }

  componentDidMount() {
    this.fetchJobsList();
    this.fetchActions();
  }

  updateJob(event) {
    const { jobs } = this.state;
    const selectedJob = jobs[event.currentTarget.value - 1];
    this.setState({ selectedJob }, (() => { this.fetchActions(); }));
  }

  // TODO Filter out starter Classes and show combined starter + advanced class
  async fetchJobsList() {
    const { api } = this.state;
    let jobs = await api.data.list('ClassJob');
    jobs = await jobs.Results;
    this.setState({ jobs });
  }

  // TODO Filter out passive actions
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
            <h1>XIV Bars</h1>
            <p>A Crossbar simulator for Final Fantasy XIV</p>

            {Object.keys(bars).map(xBar => (
              <Xbar key={xBar} id={xBar} bar={bars[xBar]} />
            ))}
          </div>

          <div className="actions">
            <h2>Job</h2>
            <div className="content-layout">
              <div className="content-left">
                <JobSelect
                  jobs={jobs}
                  updateJob={event => this.updateJob(event)}
                />
              </div>

              <div className={`${styles.panel} content-main`}>
                <ul className={styles.listActions}>
                  { actions && ActionsList }
                </ul>
              </div>
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
