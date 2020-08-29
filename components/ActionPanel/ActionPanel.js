import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Action from 'components/Action';
import GENERAL_ACTIONS from 'bin/GeneralAction';
import MAIN_COMMANDS from 'bin/MainCommand';
import MACROS from 'bin/MacroIcon';
import styles from './styles.module.scss';

function ActionPanel({ actions, roleActions }) {
  const [activeTab, setActiveTab] = useState('panel-actions');

  function handleTabClick(e) {
    const { target } = e.currentTarget.dataset;
    setActiveTab(target);
  }

  return (
    <div className={styles.actionsPanel}>
      <div className={styles.tabs}>
        <ul className={styles.tabItems}>
          <li>
            <button
              type="button"
              className={styles.tabButton}
              data-target="panel-actions"
              data-active={activeTab === 'panel-actions'}
              onClick={(e) => handleTabClick(e)}
            >
              Actions
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.tabButton}
              data-target="panel-menu"
              data-active={activeTab === 'panel-menu'}
              onClick={(e) => handleTabClick(e)}
            >
              Menu Items
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.tabButton}
              data-target="panel-macros"
              data-active={activeTab === 'panel-macros'}
              onClick={(e) => handleTabClick(e)}
            >
              Macros
            </button>
          </li>
        </ul>
      </div>

      { activeTab === 'panel-actions' && (
        <div
          className={styles.jobActionsPanel}
          aria-hidden={activeTab !== 'panel-actions'}
        >
          <div className={styles.jobActions}>
            <h4 className={styles.sectionTitle}>Job Actions</h4>
            <ul className={styles.listActions}>
              {actions && actions.map((action) => (
                <li key={`action-${action.ID}`}>
                  <Action action={action} />
                </li>
              ))}
            </ul>
          </div>

          {(roleActions && roleActions.length) > 0 && (
            <div className={styles.roleActions}>
              <h4 className={styles.sectionTitle}>Role Actions</h4>
              <ul className={styles.listActions}>
                {roleActions.map((action) => (
                  <li key={`action-${action.ID}`}>
                    <Action action={action} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.generalActions}>
            <h4 className={styles.sectionTitle}>General Actions</h4>
            <ul className={styles.listActions}>
              {GENERAL_ACTIONS.map((action) => (
                <li key={`action-${action.ID}`}>
                  <Action action={action} remote={false} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      { activeTab === 'panel-menu' && (
        <div
          className={styles.generalActions}
          aria-hidden={activeTab !== 'panel-menu'}
        >
          <h4 className={styles.sectionTitle}>Menu Items</h4>
          <ul className={styles.listActions}>
            {MAIN_COMMANDS.map((command) => (
              <li key={`command-${command.ID}`}>
                <Action action={command} tooltip={command.Name} />
              </li>
            ))}
          </ul>
        </div>
      )}

      { activeTab === 'panel-macros' && (
        <div
          className={styles.generalActions}
          aria-hidden={activeTab !== 'panel-macros'}
        >
          <h4 className={styles.sectionTitle}>Macro Icons</h4>
          <ul className={styles.listActions}>
            {MACROS.map((macro) => (
              <li key={`macro-${macro.ID}`}>
                <Action action={macro} tooltip={`Macro ${macro.ID}`} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

ActionPanel.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default ActionPanel;
