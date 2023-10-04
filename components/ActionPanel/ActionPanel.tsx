import { useEffect, useState, createRef } from 'react';
import { useAppState } from 'components/App/context';
import MACROS from '.apiData/MacroIcon.json';
import PET_ACTIONS from '.apiData/PetAction.json';
import BUDDY_ACTIONS from '.apiData/BuddyAction.json';
import COMPANY_ACTIONS from '.apiData/CompanyAction.json';
import MAIN_COMMANDS from '.apiData/MainCommand.json';
import GENERAL_ACTIONS from '.apiData/GeneralAction.json';
import { ActionType } from 'types/Action';
import ActionGroup from './ActionGroup';
import Tabs from './Tabs';

import styles from './ActionPanel.module.scss';

interface Props {
  actions: ActionType[],
  roleActions: ActionType[]
}

export function ActionPanel({ actions, roleActions }: Props) {
  const actionPanelRef = createRef<HTMLDivElement>();
  const { showAllLvl } = useAppState();
  const [activeTab, setActiveTab] = useState('panel-actions');
  const [maxHeight, setMaxHeight] = useState(0);

  function handleTabClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { target } = e.currentTarget.dataset;
    setActiveTab(target as string);
  }

  const displayActions = !showAllLvl
    ? actions.filter((action) => !action.upgradable)
    : actions;

  useEffect(() => {
    const panelTop = actionPanelRef.current?.getBoundingClientRect().y;
    const margin = 20;
    const height = panelTop ? window.innerHeight - panelTop - margin : 0;
    setMaxHeight(height);
  }, []);

  return (
    <div className={styles.actionsPanel} ref={actionPanelRef} style={{ maxHeight }}>
      <Tabs onTabClick={(e) => handleTabClick(e)} activeTab={activeTab} />

      { activeTab === 'panel-actions' && (
        <div
          className={`${styles.panel} panel`}
          aria-hidden={activeTab !== 'panel-actions'}
        >
          <ActionGroup actions={displayActions} title="Job Actions" />

          {(roleActions && (roleActions.length > 0)) && (
            <ActionGroup actions={roleActions} title="Role Actions" />
          )}
        </div>
      )}

      { activeTab === 'panel-general' && (
        <div
          className={`${styles.panel} panel`}
          aria-hidden={activeTab !== 'panel-general'}
        >
          <ActionGroup actions={GENERAL_ACTIONS} title="General Actions" />
          <ActionGroup actions={BUDDY_ACTIONS} title="Companion Actions" />
          <ActionGroup actions={PET_ACTIONS} title="Pet Actions" limit={7} />
        </div>
      )}

      { activeTab === 'panel-menu' && (
        <div
          className={`${styles.panel} panel`}
          aria-hidden={activeTab !== 'panel-menu'}
        >
          <ActionGroup actions={MAIN_COMMANDS} title="Menu Commands" />
        </div>
      )}

      { activeTab === 'panel-company' && (
        <div
          className={`${styles.panel} panel`}
          aria-hidden={activeTab !== 'panel-company'}
        >
          <ActionGroup actions={COMPANY_ACTIONS} title="Company Actions" />
        </div>
      )}

      { activeTab === 'panel-macros' && (
        <div
          className={`${styles.panel} panel`}
          aria-hidden={activeTab !== 'panel-macros'}
        >
          <ActionGroup actions={MACROS} title="Macros" />
        </div>
      )}
    </div>
  );
}

export default ActionPanel;
