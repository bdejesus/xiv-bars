 
export function fetchMock(data: unknown) {
  return jest.fn().mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => data,
  }),);
}

export default fetchMock;
