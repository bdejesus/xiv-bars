/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from 'pages/index';
import { fetchMock } from 'mocks/fetchMock';

const pushMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
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

describe('Home', () => {
  window.fetch = fetchMock();

  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /XIV BARS/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
