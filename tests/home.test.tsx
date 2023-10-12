import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import HomePage from '../app/page';

vi.mock('@clerk/nextjs', () => ({
  auth: () => new Promise((resolve) => resolve({ userId: 'asdasdasdasd' })),
  ClerkProvider: ({ children }) => <>{children}</>,
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'asdasd',
      fullName: 'Testmock Name',
    },
  }),
}));

test('Home', async () => {
  render(await HomePage());
  expect(screen.getByText(/get started/i));
});
