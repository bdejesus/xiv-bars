import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSystemDispatch, useSystemState, systemActions } from 'components/System';

import styles from './SystemMessage.module.scss';

export function SystemMessage() {
  const router = useRouter();
  const systemDispatch = useSystemDispatch();
  const { message } = useSystemState();
  const [showMessage, setShowMessage] = useState(false);
  const classNames = [
    'system-message',
    styles.message,
    message?.status
  ].join(' ');

  function resetMessage() {
    setShowMessage(false);
    setTimeout(() => {
      systemDispatch({
        type: systemActions.SET_MESSAGE,
        payload: undefined
      });
    }, 1000);
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', resetMessage);

    return () => {
      router.events.off('routeChangeComplete', resetMessage);
    };
  }, []);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      setTimeout(resetMessage, 3000);
    }
  }, [message]);

  return (
    <div className={styles.system} data-active={showMessage}>
      <div className={classNames}>
        { message?.text }
      </div>
    </div>
  );
}

export default SystemMessage;
