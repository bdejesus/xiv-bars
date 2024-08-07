import Action from 'components/Action';
import { useAppState } from 'components/App/context';
import type { ActionProps } from 'types/Action';
import styles from './ActionGroup.module.scss';

interface ActionGroupProps {
  title: string,
  actions: ActionProps[],
  limit?: number
}

export default function ActionGroup({
  title,
  actions,
  limit = undefined
}: ActionGroupProps) {
  const { showTitles } = useAppState();
  const actionsList = limit ? actions.slice(0, limit) : actions;
  return (
    <div className={styles.container} data-show-titles={showTitles}>
      <h4 className={styles.groupTitle}>{title}</h4>
      <ul className={`${styles.listActions} list-actions`}>
        {actionsList.map((action, index) => (
          <li key={`action-${action.ID}-${index}`} data-title={action.Name}>
            <Action action={action} />
          </li>
        ))}
      </ul>
    </div>
  );
}
