import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CloseButton from 'components/CloseButton';
import styles from './Modal.module.scss';

interface Props {
  children: ReactNode,
  showModal: boolean,
  className?: string,
  onClose: () => void
}

export default function Modal({
  children,
  showModal,
  className = '',
  onClose
}: Props) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(showModal);

  useEffect(() => {
    function closeModal() {
      if (onClose) onClose();
      setIsVisible(false);
    }

    router.events.on('routeChangeComplete', closeModal);

    return () => {
      router.events.off('routeChangeComplete', closeModal);
    };
  }, []);

  useEffect(() => {
    setIsVisible(showModal);
  }, [showModal]);

  return (
    <div
      className={[styles.modal, className].join(' ')}
      aria-hidden={!isVisible}
      tabIndex={-1}
    >
      <div className={`${styles.container} modal-container`}>
        <CloseButton onClick={onClose} className={styles.closeBtn} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
