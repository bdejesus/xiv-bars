import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

function Lore({ selectedJob }) {
  const [expanded, setExpanded] = useState(false);

  function toggleBody() {
    setExpanded(!expanded);
  }

  return (
    <div
      className={styles.lore}
      data-expanded={expanded}
      onClick={toggleBody}
      role="button"
      tabIndex={0}
    >
      <h3 className={styles.loreTitle}>
        {selectedJob.Name} Lore
      </h3>
      <div
        className={styles.loreBody}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: selectedJob.Description }}
      />
    </div>
  );
}

Lore.propTypes = {
  selectedJob: PropTypes.shape().isRequired
};

export default Lore;
