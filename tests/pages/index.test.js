/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { AppContextProvider } from 'components/App/context';
import Home from 'pages/index';
import { fetchMock } from 'mocks/fetchMock';

const pushMock = jest.fn()

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: {},
    push: pushMock
  }))
}));

describe('Home', () => {
  window.fetch = fetchMock();

  it('renders a heading', () => {
    render(<SessionProvider><Home /></SessionProvider>);

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
