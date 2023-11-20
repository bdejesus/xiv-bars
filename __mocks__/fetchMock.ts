/* eslint-disable @typescript-eslint/no-explicit-any */
export function fetchMock(data: any) {
  return jest.fn().mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => data,
  }),);
}

export default fetchMock;
