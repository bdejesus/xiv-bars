import { shallow } from 'tests/enzyme';
import App from 'components/App';

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
