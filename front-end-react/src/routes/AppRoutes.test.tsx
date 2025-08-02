import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../pages/Login/Login';

vi.mock('../routes/PrivateRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const queryClient = new QueryClient();


describe('AppRoutes', () => {
  describe('Login Page', () => {
    it('deve renderizar o título da página', () => {
      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <Login />
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });
  });

  it('deve redirecionar para 404 ao acessar rota inválida', () => {
    render(
      <MemoryRouter initialEntries={['/rota-inexistente']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
