import React, { Component } from 'react';

class Select extends Component {
  render() {
    return(
      <select>
        {this.props.jobs.map((job) => {
          return <option value={job}>{job}</option>
        })}
      </select>
    )
  }
}

export default Select;
