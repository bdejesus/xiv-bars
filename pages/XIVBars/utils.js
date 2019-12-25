
function encodeSlots(slots) {
  const string = Object.values(slots).map((arr) => (
    `[${
      Object.values(arr).map((obj) => (
        (obj.action && obj.action.ID) ? obj.action.ID : '0'
      )).toString()
    }]`
  )).toString();
  return `[${string}]`;
}

export default encodeSlots;
export { encodeSlots };
