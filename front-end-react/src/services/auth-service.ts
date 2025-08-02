export const login = async (email: string, senha: string): Promise<string> => {
  const response = await fetch('http://localhost:3000/validar-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  if (!response.ok) {
    throw new Error('Login inválido');
  }

  const data = await response.json();
  return data.token;
};
