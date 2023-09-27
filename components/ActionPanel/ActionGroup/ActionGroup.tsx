import Action from 'components/Action';
import { useAppState } from 'components/App/context';
import { ActionType } from 'types/Action';
import styles from './ActionGroup.module.scss';

interface Props {
  title: string,
  actions: ActionType[],
  limit?: number,
  remote?: boolean
}

export function ActionGroup({
  title, actions, limit, remote
}: Props) {
  const { showTitles } = useAppState();
  const actionsList = limit ? actions.slice(0, limit) : actions;
  return (
    <div className={styles.container} data-show-titles={showTitles}>
      <h4 className={styles.groupTitle}>{title}</h4>
      <ul className={styles.listActions}>
        {actionsList.map((action, index) => (
          <li key={`action-${action.ID}-${index}`} data-title={action.Name}>
            <Action action={action} remote={remote} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActionGroup;
