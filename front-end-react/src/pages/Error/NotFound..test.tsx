import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('exibe mensagem de erro 404', () => {
    render(<NotFound />);
    expect(screen.getByText(/Erro 404/i)).toBeInTheDocument();
  });
});
