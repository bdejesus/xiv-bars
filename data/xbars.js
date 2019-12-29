const xBarSlots = (group) => {
  const numSlots = 16;
  const slotsArr = [];

  for (let i = 1; i <= numSlots; i += 1) {
    slotsArr.push({ id: `${group}-${i}`, action: {} });
  }

  // const left = slotsArr.slice(0, 8);
  // const right = slotsArr.slice(8, slotsArr.length + 1);
  // return { left, right };

  return slotsArr;
};

const xbars = () => (
  {
    secondary: xBarSlots('secondary'),
    primary: xBarSlots('primary'),
    tertiary: xBarSlots('tertiary')
  }
);

const hotbarSlots = (group) => {
  const numSlots = 12;
  const slotsArr = [];

  for (let i = 1; i <= numSlots; i += 1) {
    slotsArr.push({ id: `${group}-${i}`, action: {} });
  }
  return slotsArr;
};

const hotbars = () => (
  {
    one: hotbarSlots('one'),
    two: hotbarSlots('two'),
    three: hotbarSlots('three'),
    four: hotbarSlots('four'),
    five: hotbarSlots('five'),
    six: hotbarSlots('six'),
    seven: hotbarSlots('seven'),
    eight: hotbarSlots('eight'),
    nine: hotbarSlots('nine')
  }
);

const layouts = ['xbars', 'hotbars'];

module.exports = { xbars: xbars(), hotbars: hotbars(), layouts };
