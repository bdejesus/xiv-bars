const chotbarNames = [
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
      name: chotbarNames[i - 1]
    });
  }

  return slotsArr;
};

const xbars = () => (
  {
    one: xBarSlots('one'),
    two: xBarSlots('two'),
    three: xBarSlots('three'),
    four: xBarSlots('four')
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
    nine: hotbarSlots('nine'),
    ten: hotbarSlots('ten')
  }
);

const layouts = ['chotbar', 'hotbar'];

module.exports = {
  chotbar: xbars(), hotbar: hotbars(), layouts, chotbarNames
};
