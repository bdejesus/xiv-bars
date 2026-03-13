import '@testing-library/jest-dom';
import 'tests/setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import LayoutCard from 'components/LayoutCard';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    asPath: '/',
    query: {},
    push: jest.fn(),
    locale: 'en',
    events: { on: jest.fn(), off: jest.fn() }
  }))
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null }))
}));

jest.mock('next-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (key: string) => key }))
}));

jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }));
jest.mock('lib/analytics', () => ({ event: jest.fn() }));
jest.mock('react-markdown', () => ({ __esModule: true, default: () => null }));

jest.mock(`${process.cwd()}/components/User`, () => ({
  useUserDispatch: jest.fn(() => jest.fn()),
  userActions: { UPDATE_LAYOUTS: 'UPDATE_LAYOUTS' }
}));

const today = new Date().toISOString();

const mockJob = {
  Abbr: 'BRD',
  Name: 'Bard',
  ID: 23,
  Role: 'RDPS',
  Discipline: 'DOW',
};

const mockLayout = {
  id: 14,
  userId: 99,
  title: 'Test Layout',
  description: 'A test description',
  jobId: 'BRD',
  isPvp: false,
  layout: 0,
  encodedSlots: '',
  createdAt: today,
  updatedAt: today,
  deletedAt: null,
  xhb: 1,
  wxhb: 0,
  exhb: 0,
  hb: [],
  published: true,
  user: { id: 99, name: 'TestUser', image: '/img.png' },
  hearted: undefined,
  _count: { hearts: 0 }
};

describe('LayoutCard', () => {
  it('renders layout title', () => {
    render(<LayoutCard layout={mockLayout as never} job={mockJob as never} />);
    expect(screen.getByText('Test Layout')).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<LayoutCard layout={mockLayout as never} job={mockJob as never} />);
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });

  it('does not show the delete button when not the owner', () => {
    render(<LayoutCard layout={mockLayout as never} job={mockJob as never} />);
    expect(screen.queryByTitle('LayoutCard.delete_layout')).not.toBeInTheDocument();
  });

  it('shows the delete button when user is the owner', () => {
    const { useSession } = jest.requireMock('next-auth/react');
    useSession.mockReturnValue({ data: { user: { id: 99 } } });

    render(<LayoutCard layout={mockLayout as never} job={mockJob as never} />);
    expect(screen.getByTitle('LayoutCard.delete_layout')).toBeInTheDocument();
  });

  it('shows delete confirmation prompt when delete button is clicked', () => {
    const { useSession } = jest.requireMock('next-auth/react');
    useSession.mockReturnValue({ data: { user: { id: 99 } } });

    render(<LayoutCard layout={mockLayout as never} job={mockJob as never} />);
    fireEvent.click(screen.getByTitle('LayoutCard.delete_layout'));
    expect(screen.getByText('LayoutCard.delete_confirm')).toBeInTheDocument();
  });

  it('hides the prompt when cancel is clicked', () => {
    const { useSession } = jest.requireMock('next-auth/react');
    useSession.mockReturnValue({ data: { user: { id: 99 } } });

    render(<LayoutCard layout={mockLayout as never} job={mockJob as never} />);
    fireEvent.click(screen.getByTitle('LayoutCard.delete_layout'));
    fireEvent.click(screen.getByText('LayoutCard.cancel'));
    expect(screen.queryByText('LayoutCard.delete_confirm')).not.toBeInTheDocument();
  });

  it('shows draft tag for unpublished layout owned by the user', () => {
    const { useSession } = jest.requireMock('next-auth/react');
    useSession.mockReturnValue({ data: { user: { id: 99 } } });

    const draft = { ...mockLayout, published: false };
    render(<LayoutCard layout={draft as never} job={mockJob as never} />);
    expect(screen.getByText('LayoutCard.draft')).toBeInTheDocument();
  });

  it('returns null when layout has no user', () => {
    const noUser = { ...mockLayout, user: null };
    const { container } = render(<LayoutCard layout={noUser as never} job={mockJob as never} />);
    expect(container.firstChild).toBeNull();
  });
});
