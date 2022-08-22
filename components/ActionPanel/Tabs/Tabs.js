import PropTypes from 'prop-types';
import styles from './Tabs.module.scss';

export function Tabs({ activeTab, onTabClick }) {
  return (
    <div className={styles.tabs}>
      <ul className={styles.tabItems}>
        <li>
          <button
            type="button"
            className={styles.tabButton}
            data-target="panel-actions"
            data-active={activeTab === 'panel-actions'}
            onClick={(e) => onTabClick(e)}
          >
            Job
          </button>
        </li>

        <li>
          <button
            type="button"
            className={styles.tabButton}
            data-target="panel-general"
            data-active={activeTab === 'panel-general'}
            onClick={(e) => onTabClick(e)}
          >
            General
          </button>
        </li>

        <li>
          <button
            type="button"
            className={styles.tabButton}
            data-target="panel-menu"
            data-active={activeTab === 'panel-menu'}
            onClick={(e) => onTabClick(e)}
          >
            Menu
          </button>
        </li>
        <li>
          <button
            type="button"
            className={styles.tabButton}
            data-target="panel-macros"
            data-active={activeTab === 'panel-macros'}
            onClick={(e) => onTabClick(e)}
          >
            Macros
          </button>
        </li>
        <li>
          <button
            type="button"
            className={styles.tabButton}
            data-target="panel-company"
            data-active={activeTab === 'panel-company'}
            onClick={(e) => onTabClick(e)}
          >
            Company
          </button>
        </li>
      </ul>
    </div>
  );
}

Tabs.propTypes = {
  activeTab: PropTypes.string,
  onTabClick: PropTypes.func.isRequired
};

Tabs.defaultProps = {
  activeTab: undefined
};

export default Tabs;
