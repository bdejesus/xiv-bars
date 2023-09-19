import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useAppState } from 'components/App/context';
import Sharing from 'components/Sharing';
import ExportToMacros from 'components/ExportToMacro';
import SaveForm from 'components/SaveForm';
import { jsonToQuery } from 'lib/utils/url';
import I18n from 'lib/I18n/locale/en-US';
import ToggleTitles from './ToggleTitles';
import ToggleMaxLvl from './ToggleMaxLvl';
import ToggleSaveForm from './ToggleSaveForm';
import styles from './ControlBar.module.scss';

export function ControlBar({ selectedJob }) {
  const router = useRouter();

  const {
    readOnly,
    showPublish,
    showModal,
    encodedSlots,
    layout,
    viewData,
    xhb,
    wxhb,
    exhb,
    hb
  } = useAppState();

  function copyLayout() {
    const query = jsonToQuery({
      l: layout, s1: encodedSlots, xhb, wxhb, exhb, hb
    });
    router.push(`/job/${selectedJob.Abbr}/new?${query}`);
  }

  return (
    <>
      <div className={styles.controlBar} data-active-modal={showModal}>
        <div className={styles.container}>
          <div className={styles.groupLeft}>
            <div className={styles.control}>
              <ToggleSaveForm />
            </div>

            { viewData && (
              <div className={styles.control}>
                <button
                  type="button"
                  onClick={copyLayout}
                  title={I18n.ControlBar.CopyLayout.copy_layout}
                >
                  { I18n.ControlBar.CopyLayout.copy_label }
                </button>
              </div>
            )}
          </div>

          <div className={styles.groupRight}>
            { !readOnly && (
              <div className={styles.control}>
                <ToggleMaxLvl />
              </div>
            )}

            <div className={styles.control}>
              <ToggleTitles />
            </div>

            <div className={styles.control}>
              <ExportToMacros />
            </div>

            <div className={styles.control}>
              <Sharing selectedJob={selectedJob} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controlContent}>
        { showPublish && <SaveForm /> }
      </div>
    </>
  );
}

ControlBar.propTypes = {
  selectedJob: PropTypes.shape()
};

ControlBar.defaultProps = {
  selectedJob: undefined
};

export default ControlBar;
