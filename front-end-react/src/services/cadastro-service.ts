export type Usuario = {
  nome: string;
  email: string;
  senha: string;
};

export const cadastrarUsuario = (usuario: any) =>
  fetch('http://localhost:3000/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    body: JSON.stringify(usuario),
  }).then((res) => {
    if (!res.ok) throw new Error();
    return res.json();
  });

export const atualizarUsuario = (id: string, usuario: any) =>
  fetch(`http://localhost:3000/api/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    body: JSON.stringify(usuario),
  }).then((res) => {
    if (!res.ok) throw new Error();
    return res.json();
  });

export const buscarUsuarioPorId = (id: string) =>
  fetch(`http://localhost:3000/api/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  }).then((res) => res.json());

export const validarCpf = (cpf: string) =>
  fetch(`http://localhost:3000/api/cpf/validar?cpf=${cpf}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  }).then((res) => res.json());
