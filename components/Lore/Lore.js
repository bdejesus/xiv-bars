import PropTypes from 'prop-types';
import I18n from 'lib/I18n/locale/en-US';
import styles from './Lore.module.scss';

export function Lore({ selectedJob }) {
  return (
    <div
      className={styles.lore}
    >
      <h3 className={styles.loreTitle}>
        {I18n.Lore.lore}
      </h3>
      <div
        className={styles.loreBody}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: selectedJob.Description }}
      />
    </div>
  );
}

Lore.propTypes = {
  selectedJob: PropTypes.shape().isRequired
};

export default Lore;
