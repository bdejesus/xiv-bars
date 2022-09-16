/* eslint-disable jsx-a11y/no-onchange */
import PropTypes from 'prop-types';
import { useAppState } from 'components/App/context';

function Options({
  id, onChange, value, children, required
}) {
  const appState = useAppState();
  const { chotbar } = appState;
  const inactive = ['xhb', 'wxhb', 'exhb'].reduce((collect, v) => {
    if (v !== id) return [...collect, appState[v]];
    return collect;
  }, []);

  return (
    <label htmlFor={id}>
      {children}

      <select
        id={id}
        name={id}
        onChange={onChange}
        value={value}
      >
        { !required && <option value={0}>Off</option> }

        { Object.keys(chotbar).map((key, index) => {
          const optValue = index + 1;
          return (
            <option
              value={optValue}
              key={key}
              disabled={inactive.includes(optValue)}
            >
              {optValue}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default Options;

Options.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
    PropTypes.array
  ]).isRequired,
  required: PropTypes.bool
};

Options.defaultProps = {
  required: false
};
