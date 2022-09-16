import PropTypes from 'prop-types';
import { group } from 'lib/utils';
import Set from './Set';

function Group({ slots }) {
  const slotSets = group(slots, 4);
  return (
    <>
      {slotSets.map((groupSlots, index) => (
        <Set slots={groupSlots} key={`set-${index}`} />
      ))}
    </>
  );
}

Group.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Group;
