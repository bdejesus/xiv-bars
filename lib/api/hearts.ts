const baseOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

export function createHeart(layoutId:number) {
  const options = {
    ...baseOptions,
    body: JSON.stringify({ method: 'heart', layoutId })
  };
  return fetch('/api/layout', options).then((data) => data.json());
}

export function breakHeart(layoutId:number, heartId:number) {
  const options = {
    ...baseOptions,
    body: JSON.stringify({ method: 'unheart', layoutId, heartId })
  };
  return fetch('/api/layout', options).then((data) => data.json());
}
