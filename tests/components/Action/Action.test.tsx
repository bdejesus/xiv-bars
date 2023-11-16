import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Action from 'components/Action';

describe('Action', () => {
  it('renders an Action', () => {
    render(<Action action={{ ID: 1, Name: 'Test' }} />);

    const actionName = screen.getByRole('button', { name: /Test Action/i });

    expect(actionName.dataset.title).toBe('Test');
    expect(actionName).toBeInTheDocument();
  });
});
