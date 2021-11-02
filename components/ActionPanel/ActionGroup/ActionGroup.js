import React from 'react';
import PropTypes from 'prop-types';
import Action from 'components/Action';
import styles from './ActionGroup.module.scss';

function ActionGroup({
  title, actions, limit, remote
}) {
  const actionsList = limit ? actions.slice(0, limit) : actions;
  return (
    <div className={styles.container}>
      <h4 className={styles.groupTitle}>{title}</h4>
      <ul className={styles.listActions}>
        {actionsList.map((action, index) => (
          <li key={`action-${action.ID}-${index}`}>
            <Action action={action} remote={remote} />
          </li>
        ))}
      </ul>
    </div>
  );
}

ActionGroup.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    ID: PropTypes.number,
    Name: PropTypes.string,
    Icon: PropTypes.string
  })).isRequired,
  limit: PropTypes.number,
  remote: PropTypes.bool
};

ActionGroup.defaultProps = {
  limit: undefined,
  remote: true
};

export default ActionGroup;
