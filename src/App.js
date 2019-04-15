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
    this.api = new XIVAPI();
    this.state = {
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

  // TODO Refactor promises to handle error cases
  // TODO Filter out starter Classes and show combined starter + advanced class
  async fetchJobsList() {
    let jobs = await this.api.data.list('ClassJob');
    jobs = await jobs.Results;
    this.setState({ jobs });
  }

  async fetchActions() {
    const { selectedJob } = this.state;
    let actions = await this.api.search('', { filters: `ClassJob.ID=${selectedJob.ID}` });
    actions = await actions.Results;
    actions = actions.filter(action => action.UrlType === 'Action');
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
            <p>A Final Fantasy XIV Crossbar Simulation Tool.</p>
            <p>Simulate what your crossbar actions could look like when playing Final Fantasy XIV with a gamepad or controller. Use the Class selector to load actions for that class.</p>

            {Object.keys(bars).map(xBar => (
              <Xbar key={xBar} id={xBar} bar={bars[xBar]} />
            ))}
          </div>

          <div className={styles.panel}>
            <div className="content-layout content-middle">
              <div className="content-left">
                <h2>Class</h2>
              </div>

              <div className="content-main">
                <JobSelect
                  jobs={jobs}
                  updateJob={event => this.updateJob(event)}
                />
              </div>
            </div>

            <ul className={styles.listActions}>
              { actions && ActionsList }
            </ul>
          </div>

        </div>
        <div className={`${styles.info} container`}>
          <p><a href="https://github.com/bdejesus/xiv-bars">XIV Bars on Github</a></p>
          <p>This app uses <a href="https://xivapi.com/">XIVAPI</a></p>
          <p>All Final Fantasy XIV content is property of Square Enix Co., LTD</p>
        </div>
      </main>
    );
  }
}

App.propTypes = {
  bars: PropTypes.shape().isRequired
};

export default connect(mapStateToProps)(App);
