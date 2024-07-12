import Action from 'components/Action';
import { useAppState } from 'components/App/context';
import type { ActionProps } from 'types/Action';
import styles from './ActionGroup.module.scss';

interface ActionGroupProps {
  title: string,
  actions: ActionProps[],
  layout?: 'default' | 'alt'
}

function ComboAction({ action }:{ action:ActionProps }) {
  return (
    <li data-title={action.Name} className={styles.comboGroup}>
      <Action action={action} />
      { action.ComboActions && (
        <ul>
          { action.ComboActions?.map((comboAction) => <ComboAction action={comboAction} key={`${action.ID}-${comboAction.ID}`} />)}
        </ul>
      )}
    </li>
  );
}

function AltLayout({ actions }:{ actions:ActionProps[]}) {
  const actionsMap:{ [key: number]:ActionProps } = {};
  const actionResults:ActionProps[] = [];

  actions.forEach((action) => {
    actionsMap[action.ID as keyof typeof actionsMap] = { ...action };
  });

  actions.forEach((action) => {
    const parentID = action.ActionComboTargetID as keyof typeof actionsMap;
    const actionID = action.ID as keyof typeof actionsMap;
    if (parentID !== 0) {
      const parent = actionsMap[parentID];
      if (parent) {
        parent.ComboActions = parent.ComboActions || [];
        parent.ComboActions.push(actionsMap[actionID]);
      }
    } else {
      actionResults.push(actionsMap[actionID]);
    }
  });

  return (
    <ul className={`${styles.listActions} list-actions`}>
      {actionResults.map((action, index) => <ComboAction key={`action-${action.ID}-${index}`} action={action} />)}
    </ul>
  );
}

export default function ActionGroup({
  title,
  actions,
  layout = 'default'
}: ActionGroupProps) {
  const { showTitles } = useAppState();
  const filteredActions = actions.filter((ac) => ac.DisableOrder !== 0);

  return (
    <div className={styles.container} data-show-titles={showTitles}>
      <h4 className={styles.groupTitle}>{title}</h4>

      { layout === 'alt' && showTitles
        ? <AltLayout actions={filteredActions} />
        : (
          <ul className={`${styles.listActions} list-actions`}>
            {filteredActions.map((action, index) => (
              <li key={`action-${action.ID}-${index}`} data-title={action.Name}>
                <Action action={action} />
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
