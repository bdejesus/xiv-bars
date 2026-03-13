import '@testing-library/jest-dom';
import 'tests/setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from 'components/Modal';

const pushMock = jest.fn();
const onMock = jest.fn();
const offMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    asPath: '/test',
    query: {},
    push: pushMock,
    locale: 'en',
    events: { on: onMock, off: offMock }
  }))
}));

jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }));

const onClose = jest.fn();

describe('Modal', () => {
  it('renders children when visible', () => {
    render(
      <Modal showModal onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('is visible when showModal is true', () => {
    const { container } = render(
      <Modal showModal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'false');
  });

  it('is hidden when showModal is false', () => {
    const { container } = render(
      <Modal showModal={false} onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <Modal showModal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('registers and cleans up the routeChangeComplete listener', () => {
    const { unmount } = render(
      <Modal showModal onClose={onClose}>
        <span>content</span>
      </Modal>
    );
    expect(onMock).toHaveBeenCalledWith('routeChangeComplete', expect.any(Function));
    unmount();
    expect(offMock).toHaveBeenCalledWith('routeChangeComplete', expect.any(Function));
  });
});
