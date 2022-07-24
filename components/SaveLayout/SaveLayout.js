import { useState } from 'react';
import Modal from 'components/Modal';
import SaveForm from './SaveForm';

import styles from './SaveLayout.module.scss';

export function SaveLayout() {
  const [showModal, setShowModal] = useState(false);

  function toggleModal() {
    setShowModal(!showModal);
  }

  return (
    <>
      <button type="button" title="Save this Layout" onClick={toggleModal}>
        <img src="/images/icon-save.svg" className="btn-icon" alt="Save Icon" />
        Save
      </button>

      <Modal toClose={(e) => toggleModal(e)} hidden={!showModal}>
        <div className={`modal-content ${styles.content}`}>
          <div className="modal-header">
            <h3>Save Your Layout</h3>
            <p>Provide usage notes and share with others, or come back later to edit.</p>
          </div>

          <SaveForm onSubmit={() => toggleModal()} />
        </div>
      </Modal>
    </>
  );
}

export default SaveLayout;
