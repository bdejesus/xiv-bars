import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSystemDispatch, useSystemState, SystemActions } from 'components/System';

export function SystemMessage() {
  const router = useRouter();
  const systemDispatch = useSystemDispatch();
  const { message } = useSystemState();

  useEffect(() => {
    function resetMessage() {
      systemDispatch({
        type: SystemActions.SET_MESSAGE,
        payload: {
          status: undefined,
          text: undefined
        }
      });
    }

    router.events.on('routeChangeComplete', resetMessage)

    return () => {
      router.events.off('routeChangeComplete', resetMessage);
    };
  }, []);

  if (!message) return null;

  return (
    <div className={`system-message ${message.status}`}>
      { message.text }
    </div>
  );
}

export default SystemMessage;
