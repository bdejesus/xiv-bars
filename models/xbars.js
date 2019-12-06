const slots = (group) => {
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
      secondary: slots('secondary'),
      primary: slots('primary'),
      tertiary: slots('tertiary')
    }
  }
);

module.exports = xBars();
