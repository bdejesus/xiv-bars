import '@testing-library/jest-dom';
import 'tests/setupTests';
import { render, screen } from '@testing-library/react';
import Sharing from 'components/Sharing';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    asPath: '/job/BRD',
    query: { jobId: 'BRD' },
    push: jest.fn(),
    locale: 'en',
    events: { on: jest.fn(), off: jest.fn() }
  }))
}));

jest.mock('next-auth/react', () => ({ useSession: jest.fn(() => ({})) }));
jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }));

jest.mock(`${process.cwd()}/components/App/context`, () => ({
  useAppState: jest.fn(() => ({ viewAction: 'new' }))
}));

describe('Sharing', () => {
  it('renders a share URL input', () => {
    render(<Sharing />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a copy button', () => {
    render(<Sharing />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('input is read-only', () => {
    render(<Sharing />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('shows a layout-specific URL when viewAction is show and layoutId is present', () => {
    const { useRouter } = jest.requireMock('next/router');
    const { useAppState } = jest.requireMock(`${process.cwd()}/components/App/context`);
    useRouter.mockReturnValue({
      asPath: '/job/BRD/42',
      query: { jobId: 'BRD', layoutId: '42' },
      push: jest.fn(),
      locale: 'en',
      events: { on: jest.fn(), off: jest.fn() }
    });
    useAppState.mockReturnValue({ viewAction: 'show' });

    render(<Sharing />);
    const value = (screen.getByRole('textbox') as HTMLInputElement).value;
    expect(value).toContain('BRD');
    expect(value).toContain('42');
  });
});
