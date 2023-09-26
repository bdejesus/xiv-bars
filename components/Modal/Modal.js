import { useEffect } from 'react';
import childrenProps from 'lib/propTypes/children';
import CloseButton from 'components/CloseButton';
import { useAppDispatch } from 'components/App/context';
import styles from './Modal.module.scss';

export function Modal({ children, hidden, toClose }) {
  const appDispatch = useAppDispatch();

  console.log(toClose);

  useEffect(() => {
    appDispatch({ type: 'toggleModal' });
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

Modal.propTypes = childrenProps;

export default Modal;
