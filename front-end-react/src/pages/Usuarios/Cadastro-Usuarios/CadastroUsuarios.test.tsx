import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CadastroUsuario from './CadastroUsuarios';
import { vi } from 'vitest';

// Mock do react-query para useMutation
const mockMutate = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
  useQuery: () => ({ data: null }),
}));

// Mock do react-router-dom para useNavigate e useParams
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
}));

describe('CadastroUsuario', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it('renderiza formulário e chama mutate no submit com dados válidos', async () => {
    render(<CadastroUsuario />);

    // Preenche os campos obrigatórios
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Kalleo' } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '12345678900' } });
    fireEvent.change(screen.getByLabelText(/Login/i), { target: { value: 'kalleo' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha123' } });
    fireEvent.change(screen.getByLabelText(/Perfil/i), { target: { value: 'admin' } });

    // Clica no botão de submit
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    // Espera mutate ser chamado com os dados corretos
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        nome: 'Kalleo',
        cpf: '12345678900',
        login: 'kalleo',
        senha: 'senha123',
        perfil: 'admin',
      });
    });
  });
});
