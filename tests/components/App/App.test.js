import { shallow } from 'tests/enzyme';
import App from 'components/App';

jest.mock('data/GeneralAction', () => {}, { virtual: true });
jest.mock('data/MainCommand', () => {}, { virtual: true });
jest.mock('data/MacroIcon', () => {}, { virtual: true });
jest.mock('data/PetAction', () => {}, { virtual: true });
jest.mock('data/BuddyAction', () => {}, { virtual: true });
jest.mock('data/CompanyAction', () => {}, { virtual: true });

const props = {
  jobs: [],
  actions: [],
  roleActions: []
};

describe('App', () => {
  const wrapper = shallow(<App {...props} />);

  it('Renders <App />', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
