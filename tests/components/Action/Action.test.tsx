import '@testing-library/jest-dom';
import 'tests/setupTests';
import { render, screen } from '@testing-library/react';
import Action from 'components/Action';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    locale: 'en'
  }))
}));

describe('Action', () => {
  it('renders an Action', () => {
    render(<Action action={{ ID: 1, Name: 'Test Action', Icon: { id: 1, path: '', path_hr1: '' } }} />);

    const actionName = screen.getByRole('button', { name: /Test Action/i });

    expect(actionName.dataset.title).toBe('Test Action');
    expect(actionName).toBeInTheDocument();
  });
});
