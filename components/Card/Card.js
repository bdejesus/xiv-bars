import PropTypes from 'prop-types';

import styles from './Card.module.scss';

function Card({ children, className }) {
  return (
    <div className={[styles.card, className].join(' ')}>
      { children }
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.shape(),
    PropTypes.array
  ]).isRequired,
  className: PropTypes.string
};

Card.defaultProps = {
  className: ''
};

export default Card;
