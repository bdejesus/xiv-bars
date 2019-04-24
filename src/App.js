/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import XIVAPI from 'xivapi-js';
import Xbar from './components/Xbar';
import Action from './components/Action';
import JobSelect from './components/JobSelect';
import Tooltip from './components/Tooltip';
import { ascByKey } from './utils/array';
import styles from './styles.scss';

const mapStateToProps = state => ({ bars: state.bars, tooltip: state.tooltip });

class App extends Component {
  constructor(props) {
    super(props);
    this.api = new XIVAPI();
    window.api = this.api;
    this.state = {
      jobs: [],
      actions: [],
      selectedJob: { }
    };
  }

  componentDidMount() {
    this.fetchJobsList();
  }

  updateJob(id) {
    const { jobs } = this.state;
    const selectedJob = jobs.find(job => parseInt(job.ID, 10) === parseInt(id, 10));
    this.setState({ selectedJob }, (() => { this.fetchActions(); }));
  }

  // TODO Refactor promises to handle error cases
  // TODO Filter out starter Classes and show combined starter + advanced class
  async fetchJobsList() {
    let jobs = await this.api.data.list('ClassJob');
    jobs = await jobs.Results;
    jobs = jobs.sort(ascByKey('Name'));
    const selectedJob = jobs[0];
    this.setState({ jobs, selectedJob }, () => this.fetchActions());
  }

  async fetchActions() {
    const { selectedJob } = this.state;
    let actions = await this.api.search('', { filters: `ClassJob.ID=${selectedJob.ID}` });
    actions = await actions.Results;
    actions = actions.filter(action => action.UrlType === 'Action');
    this.setState({ actions });
  }

  render() {
    const { bars, tooltip } = this.props;
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
      <React.Fragment>
        <div className="panel">
          <div className={styles.xbarGroup}>
            {Object.keys(bars).map(xBar => (
              <Xbar key={xBar} id={xBar} bar={bars[xBar]} />
            ))}
          </div>
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

        { tooltip && <Tooltip content={tooltip.content} position={tooltip.position} /> }
      </React.Fragment>
    );
  }
}

App.propTypes = {
  bars: PropTypes.shape().isRequired,
  tooltip: PropTypes.shape()
};

App.defaultProps = {
  tooltip: null
};

export default connect(mapStateToProps)(App);
