/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import 'tests/setupTests';
import { render, screen, waitFor } from '@testing-library/react';
import Home from 'pages/index';
import { fetchMock } from 'mocks/fetchMock';

const pushMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    asPath: '/test',
    query: {},
    push: pushMock,
    locale: 'en',
    events: {
      on: jest.fn(() => ({})),
      off: jest.fn(() => ({}))
    }
  }))
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({}))
}));

jest.mock('react-markdown', () => ({
  ReactMarkdown: jest.fn()
}));

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({}))
}));

describe('Home', () => {
  window.fetch = fetchMock();

  it('renders a heading', async () => {
    waitFor(() => render(<Home />));

    const heading = screen.getByRole('heading', {
      name: /XIV BARS/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
