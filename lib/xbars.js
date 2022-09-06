export const chotbarSlotNames = [
  'LDD',
  'LDL',
  'LDU',
  'LDR',
  'LAD',
  'LAL',
  'LAU',
  'LAR',
  'RDD',
  'RDL',
  'RDU',
  'RDR',
  'RAD',
  'RAL',
  'RAU',
  'RAR'
];

const xBarSlots = (group, key) => {
  const numSlots = 16;
  const slotsArr = [];

  for (let i = 1; i <= numSlots; i += 1) {
    slotsArr.push({
      id: `${group}-${i}`,
      key,
      action: {},
      name: chotbarSlotNames[i - 1]
    });
  }

  return slotsArr;
};

export const xbars = () => (
  {
    one: xBarSlots('one', 1),
    two: xBarSlots('two', 2),
    three: xBarSlots('three', 3),
    four: xBarSlots('four', 4),
    five: xBarSlots('five', 5),
    six: xBarSlots('six', 6),
    seven: xBarSlots('seven', 7),
    eight: xBarSlots('eight', 8)
  }
);

export const chotbar = xbars();

const hotbarSlots = (group, key) => {
  const numSlots = 12;
  const slotsArr = [];

  for (let i = 1; i <= numSlots; i += 1) {
    slotsArr.push({ id: `${group}-${i}`, action: {}, key });
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
    nine: hotbarSlots('nine'),
    ten: hotbarSlots('ten')
  }
);

export const hotbar = hotbars();

export const layouts = ['chotbar', 'hotbar'];

export const keyToInt = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
};

const moduleExports = {
  chotbar, hotbar, layouts, chotbarSlotNames, keyToInt
};

export default moduleExports;
