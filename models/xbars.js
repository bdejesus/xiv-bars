const xBarSlots = (group) => {
  const num = 16;
  const slotsArr = [];

  let i = num;
  for (i; i >= 1; i -= 1) {
    slotsArr.push({ id: `${group}-${i}`, action: {} });
  }
  return slotsArr;
};

const xBars = () => (
  {
    jobs: [],
    selectedJob: null,
    selectedAction: null,
    tooltip: null,
    bars: {
      secondary: xBarSlots('secondary'),
      primary: xBarSlots('primary'),
      tertiary: xBarSlots('tertiary')
    }
  }
);

const hotbarSlots = (group) => {
  const num = 12;
  const slotsArr = [];

  for (let i = 1; i <= num; i += 1) {
    slotsArr.push({ id: `${group}-${i}`, action: {} });
  }
  return slotsArr;
};

const hotbars = () => (
  {
    bars: {
      one: hotbarSlots('one'),
      two: hotbarSlots('two'),
      three: hotbarSlots('three'),
      four: hotbarSlots('four'),
      five: hotbarSlots('five'),
      six: hotbarSlots('six'),
      seven: hotbarSlots('seven'),
      eight: hotbarSlots('eight'),
    }
  }
);

module.exports = { xBars: xBars(), hotbars: hotbars() };
