import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useMutation } from '@tanstack/react-query';
import { criptografia } from '../../services/utils';
interface LoginParams {
  login: string;
  senha: string;
}

interface LoginResponse {
  token: string;  
}

const loginUser = async ({ login, senha }: LoginParams): Promise<LoginResponse> => {

  const hash = criptografia({login, senha});  
  const response = await fetch('http://localhost:3000/validar-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({hash}),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Credenciais inválidas');
  }

  return response.json();
};

const Login = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const [invalido, setInvalido] = useState(false);

 const mutation = useMutation<LoginResponse, Error, LoginParams>({
  mutationFn: loginUser,
  onSuccess: (data) => {
    sessionStorage.setItem('token', data.token);
    navigate('/home');
  },
  onError: (error: any) => {
    setInvalido(error.message);
  },
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInvalido(false);
    mutation.mutate({ login, senha });
  };

  return (
    <div className={styles.wrapper}>
      <div className={`card shadow p-4 ${styles.loginCard}`}>
        <h3 className={styles.loginTitle}>Sistema de Vendas</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="login" className={styles.formLabel}>Login</label>
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="login"
              placeholder="Digite seu login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="senha" className={styles.formLabel}>Senha</label>
            <input
              type="password"
              className={`form-control ${styles.formControl}`}
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>

          <button
            type="submit"
            className={`btn w-100 mt-3 ${styles.loginBtn}`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Entrando...' : 'Entrar'}
          </button>

          {invalido && (
            <small className={styles.errorMessage}>Login e/ou senha inválidos</small>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
