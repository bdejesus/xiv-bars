import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hearts from 'components/Hearts';
import { createHeart, destroyHeart } from 'lib/api/hearts';

jest.mock('lib/api/hearts', () => ({
  createHeart: jest.fn(() => Promise.resolve('Mocked createHeart response')),
  destroyHeart: jest.fn(() => Promise.resolve('Mocked destroyHeart response')),
}));

jest.mock('lib/analytics', () => ({
  event: jest.fn()
}));

describe('Hearts', () => {
  it('renders a Heart button', () => {
    render(<Hearts layoutId={1} count={0} />);
    const heartBtn = screen.getByRole('button', { name: /Heart/i });
    expect(heartBtn).toBeInTheDocument();
  });

  it('is disabled by default', async () => {
    render(<Hearts layoutId={1} count={0} />);
    const heartBtn = screen.getByRole('button', { name: /Heart/i });
    expect(heartBtn).toBeDisabled();
  });

  it('can create hearts', async () => {
    const layoutId = 12;
    render(<Hearts layoutId={layoutId} count={0} disabled={false} />);
    const heartBtn = screen.getByRole('button', { name: /Heart/i });
    expect(heartBtn.dataset.title).toBe('Hearts.heartTitle');
    userEvent.click(heartBtn);
    await waitFor(() => expect(createHeart).toHaveBeenCalledWith(layoutId));
  });

  it('can destroy hearts', async () => {
    const layoutId = 34;
    const hearted = { id: 11, userId: 1, layoutId };
    render(<Hearts layoutId={layoutId} count={1} disabled={false} hearted={hearted} />);
    const heartBtn = screen.getByRole('button', { name: /Heart/i });
    expect(heartBtn.dataset.title).toBe('Hearts.unheartTitle');
    userEvent.click(heartBtn);
    await waitFor(() => {
      expect(destroyHeart).toHaveBeenCalledWith(layoutId, hearted.id);
    });
  });
});
