const slots = () => (
  [
    { id: 'lTop', action: null },
    { id: 'lRight', action: null },
    { id: 'lBottom', action: null },
    { id: 'lLeft', action: null },
    { id: 'rTop', action: null },
    { id: 'rRight', action: null },
    { id: 'rBottom', action: null },
    { id: 'rLeft', action: null }
  ]
);

export default () => (
  {
    selectedAction: null,
    bars: {
      primary: {
        left: slots(),
        right: slots()
      }
    }
  }
);
