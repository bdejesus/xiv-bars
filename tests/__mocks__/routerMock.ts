export default function routerMock() {
  return {
    useRouter: jest.fn(() => ({
      query: {},
      push: jest.fn(),
    }))
  };
}
