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

const xBarSlots = (group) => {
  const numSlots = 16;
  const slotsArr = [];

  for (let i = 1; i <= numSlots; i += 1) {
    slotsArr.push({
      id: `${group}-${i}`,
      action: {},
      name: chotbarSlotNames[i - 1]
    });
  }

  return slotsArr;
};

export const xbars = () => (
  {
    one: xBarSlots('one'),
    two: xBarSlots('two'),
    three: xBarSlots('three'),
    four: xBarSlots('four'),
    five: xBarSlots('five'),
    six: xBarSlots('six'),
    seven: xBarSlots('seven'),
    eight: xBarSlots('eight'),
  }
);

export const chotbar = xbars();

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
    nine: hotbarSlots('nine'),
    ten: hotbarSlots('ten')
  }
);

export const hotbar = hotbars();

export const layouts = ['chotbar', 'hotbar'];

const moduleExports = {
  chotbar, hotbar, layouts, chotbarSlotNames
};

export default moduleExports;
