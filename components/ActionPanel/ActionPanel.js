import React, { useState } from 'react';
import PropTypes from 'prop-types';

import GENERAL_ACTIONS from 'bin/GeneralAction';
import MAIN_COMMANDS from 'bin/MainCommand';
import MACROS from 'bin/MacroIcon';
import PET_ACTIONS from 'bin/PetAction';
import BUDDY_ACTIONS from 'bin/BuddyAction';
import COMPANY_ACTIONS from 'bin/CompanyAction';

import ActionGroup from './ActionGroup';
import Tabs from './Tabs';

import styles from './styles.module.scss';

function ActionPanel({ actions, roleActions }) {
  const [activeTab, setActiveTab] = useState('panel-actions');

  function handleTabClick(e) {
    const { target } = e.currentTarget.dataset;
    setActiveTab(target);
  }

  return (
    <div className={styles.actionsPanel}>
      <Tabs onTabClick={handleTabClick} activeTab={activeTab} />

      { activeTab === 'panel-actions' && (
        <div
          className={styles.jobActionsPanel}
          aria-hidden={activeTab !== 'panel-actions'}
        >
          <ActionGroup actions={actions} title="Job Actions" />

          {(roleActions && roleActions.length) > 0 && (
            <ActionGroup actions={roleActions} title="Role Actions" />
          )}
        </div>
      )}

      { activeTab === 'panel-general' && (
        <>
          <ActionGroup actions={GENERAL_ACTIONS} title="General Actions" />
          <ActionGroup actions={BUDDY_ACTIONS} title="Companion Actions" />
          <ActionGroup actions={PET_ACTIONS} title="Pet Actions" limit={7} />
        </>
      )}

      { activeTab === 'panel-menu' && (
        <ActionGroup actions={MAIN_COMMANDS} title="Menu Commands" />
      )}

      { activeTab === 'panel-company' && (
        <ActionGroup actions={COMPANY_ACTIONS} title="Company Actions" />
      )}

      { activeTab === 'panel-macros' && (
        <ActionGroup actions={MACROS} title="Macros" />
      )}
    </div>
  );
}

ActionPanel.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default ActionPanel;
