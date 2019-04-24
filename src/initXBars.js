const slots = () => {
  const num = 16;
  const slotsArr = [];

  let i = num;
  for (i; i >= 1; i -= 1) {
    slotsArr.push({ id: i, action: {} });
  }
  return slotsArr;
};

export default () => (
  {
    selectedAction: null,
    tooltip: null,
    bars: {
      primary: slots(),
      secondary: slots(),
      tertiary: slots()
    }
  }
);
