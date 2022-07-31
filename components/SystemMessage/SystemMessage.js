import { useAppState } from 'components/App/context';

export function SystemMessage() {
  const { message } = useAppState();

  if (!message) return null;

  return (
    <div className={`system-message ${message.type}`}>
      { message.body }
    </div>
  );
}

export default SystemMessage;
