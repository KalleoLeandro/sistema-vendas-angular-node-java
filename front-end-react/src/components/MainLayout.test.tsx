// src/components/MainLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import { beforeEach, describe, expect, it } from 'vitest';

describe('MainLayout', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.classList.remove('sb-sidenav-toggled');
    });

    it('renderiza navbar, sidebar e conteúdo filho', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route index element={<div>Conteúdo Teste</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getAllByText(/Sistema Vendas/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Sistema Vendas/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Conteúdo Teste/i)).toBeInTheDocument();

    });

    it('adiciona classe sb-sidenav-toggled se localStorage estiver com valor "true"', () => {
        localStorage.setItem('sb|sidebar-toggle', 'true');

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route index element={<div>Teste Sidebar Toggle</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(document.body.classList.contains('sb-sidenav-toggled')).toBe(true);
    });
});
