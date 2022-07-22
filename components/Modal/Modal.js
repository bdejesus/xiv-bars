import childrenProps from 'propTypes/children';
import CloseButton from 'components/CloseButton';

import styles from './Modal.module.scss';

export function Modal({ children, hidden, toClose }) {
  return (
    <div
      className={styles.modal}
      aria-hidden={hidden}
      tabIndex={-1}
    >
      <div className={styles.container}>
        <CloseButton onClick={toClose} />
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = childrenProps;

export default Modal;
