import { useSystemState } from 'components/System';

export function SystemMessage() {
  const { message } = useSystemState();

  if (!message) return null;

  return (
    <div className={`system-message ${message.status}`}>
      { message.text }
    </div>
  );
}

export default SystemMessage;
