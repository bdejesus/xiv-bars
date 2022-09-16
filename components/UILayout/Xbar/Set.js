import PropTypes from 'prop-types';
import Slot from 'components/Slot';
import styles from './Xbar.module.scss';

function Set({ slots }) {
  return (
    <div className={styles.set}>
      { slots.map((slot) => (
        <Slot
          id={slot.id}
          key={`slot-${slot.id}`}
          action={slot.action}
          className={styles.slot}
        />
      ))}
    </div>
  );
}

Set.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Set;
