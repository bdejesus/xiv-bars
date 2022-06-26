import PropTypes from 'prop-types';

const moduleExports = {
  children: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.arrayOf(PropTypes.shape())
  ]).isRequired
};

export default moduleExports;
