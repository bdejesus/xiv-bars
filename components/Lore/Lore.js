import React from 'react';
import PropTypes from 'prop-types';
import styles from './Lore.module.scss';

function Lore({ selectedJob }) {
  return (
    <div className="container">
      <div className={styles.lore}>
        <h3 className={styles.loreTitle}>
          {selectedJob.Name} Lore
        </h3>
        <div
          className={styles.loreBody}
        // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: selectedJob.Description }}
        />
      </div>
    </div>
  );
}

Lore.propTypes = {
  selectedJob: PropTypes.shape().isRequired
};

export default Lore;
