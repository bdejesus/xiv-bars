import fetch from 'node-fetch';
import { useRef, useState } from 'react';
import { useAppState } from 'components/App/context';
import Modal from 'components/Modal';
import styles from './SaveLayout.module.scss';

export function SaveLayout() {
  const [showModal, setShowModal] = useState(false);
  const titleField = useRef();
  const descriptionField = useRef();

  const {
    selectedJob,
    layout,
    encodedSlots
  } = useAppState();

  function toggleModal() {
    setShowModal(!showModal);
  }

  function saveLayout() {
    const title = titleField.current.value;
    const description = descriptionField.current.value;

    fetch('/api/layout/create', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        layout,
        encodedSlots,
        jobId: selectedJob.ID
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((data) => data.json())
      .then((json) => {
        console.log(json);
        toggleModal();
      });
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

          <form>
            <div className="control">
              <label htmlFor="title">
                <div>Title</div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  ref={titleField}
                  className={styles.titleField}
                />
              </label>
            </div>

            <div className="control">
              <label htmlFor="description">
                <div>Description</div>
                <textarea
                  id="description"
                  ref={descriptionField}
                  className={styles.descriptionField}
                />
              </label>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={saveLayout}>Save</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default SaveLayout;
