const slots = (group) => {
  const num = 16;
  const slotsArr = [];

  let i = num;
  for (i; i >= 1; i -= 1) {
    slotsArr.push({ id: `${group}-${i}`, action: {} });
  }
  return slotsArr;
};

export default () => (
  {
    selectedAction: null,
    tooltip: null,
    bars: {
      primary: slots('primary'),
      secondary: slots('secondary'),
      tertiary: slots('tertiary')
    }
  }
);
