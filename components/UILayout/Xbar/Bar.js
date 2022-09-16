import PropTypes from 'prop-types';
import Group from './Group';
import styles from './Xbar.module.scss';

function Bar({ bar }) {
  const barGroups = {
    left: bar.slice(0, 8),
    right: bar.slice(8, bar.length + 1)
  };

  return (
    <>
      {Object.keys(barGroups).map((slots, index) => (
        <div className={`${styles[slots]} ${slots}`} key={`group-${index}`}>
          <Group slots={barGroups[slots]} />
        </div>
      ))}
    </>
  );
}

Bar.propTypes = {
  bar: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Bar;
