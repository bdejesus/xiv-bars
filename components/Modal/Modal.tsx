import React, { ReactNode, useEffect } from 'react';
import CloseButton from 'components/CloseButton';
import { useAppDispatch } from 'components/App/context';
import { AppAction } from 'components/App/actions';
import styles from './Modal.module.scss';

interface Props {
  children: ReactNode,
  hidden: boolean,
  toClose: React.MouseEventHandler
}

export function Modal({ children, hidden, toClose }: Props) {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch({ type: AppAction.TOGGLE_MODAL });
  }, [hidden]);

  return (
    <div
      className={styles.modal}
      aria-hidden={hidden}
      tabIndex={-1}
    >
      <div className={styles.container}>
        { toClose && <CloseButton onClick={toClose} /> }
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
