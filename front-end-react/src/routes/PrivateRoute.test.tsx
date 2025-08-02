import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { describe, expect, it } from 'vitest';

function MockHome() {
  return <h1>Home</h1>;
}

function MockLogin() {
  return <h1>Login</h1>;
}

describe('PrivateRoute', () => {
  it('redireciona para /login se não houver token', () => {
    sessionStorage.removeItem('token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<MockHome />} />
          </Route>
          <Route path="/login" element={<MockLogin />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('exibe o conteúdo protegido se houver token', () => {
    sessionStorage.setItem('token', 'mocked-token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<MockHome />} />
          </Route>
          <Route path="/login" element={<MockLogin />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
});
