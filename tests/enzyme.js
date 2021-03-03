import Enzyme, {
  shallow, render, mount, configure
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// React 16 Enzyme adapter
configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
export { shallow, mount, render };
export default Enzyme;
