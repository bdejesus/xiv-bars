import React, { Component } from 'react';
import XIV from './utils/xiv-api';
import styles from './styles.scss';
import Xbar from './Xbar';
import Item from './Item';

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
  }

  handleDrag(action) {
    this.setState({
      selectedAction: action
    })
  }

  getClassJobs() {
    XIV.search()

    var ids = [30];

    // eslint-disable-next-line array-callback-return
    ids.map((id) => {
      var requestUri = `https://xivapi.com/ClassJobCategory/${id}?`;
      fetch (`${requestUri}key=${this.state.key}`, { mode: 'cors' })
        .then(response => response.json())
        .then((data) => {
          var jobs = data.GameContentLinks.ClassJob.ClassJobCategory
          this.setState({ jobs: jobs })
        })
    })
  }

  getJobActions() {
    var id = this.state.selectedJob
    var requestUri = `https://xivapi.com/search?filters=ClassJob.ID=${id}&columns=ID,Name,UrlType&`;
      fetch (`${requestUri}key=${this.state.key}`, { mode: 'cors' })
        .then(response => response.json())
        .then((data) => {
          var actions = data.Results;
          this.setState({ actions: actions })
        })
  }

  componentWillMount() {
    this.getClassJobs()
    this.getJobActions()
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

    const jobsList =
      this.state.jobs.map((job) => {
        return (
          <option value={job}>{job}</option>
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
            <p>GLA</p>

            <form>
              <select name='jobSelect' id='jobSelect'>
                { this.state.jobs && jobsList }
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
