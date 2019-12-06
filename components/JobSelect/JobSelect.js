import React from 'react';
import PropTypes from 'prop-types';
import Modal from "./Modal";
import JobSelectContextProvider from './context';

function JobSelect({ jobs, selectedJob }) {
  return (
    <JobSelectContextProvider>
      <Modal jobs={jobs} selectedJob={selectedJob} />
    </JobSelectContextProvider>
  );
}

JobSelect.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape({
    ID: PropTypes.number,
    Icon: PropTypes.string,
    Abbr: PropTypes.string,
    Name: PropTypes.string
  }).isRequired
};

export default JobSelect;
