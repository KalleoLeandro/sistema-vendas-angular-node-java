import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { atualizarUsuario, buscarUsuarioPorId, cadastrarUsuario, validarCpf } from '../../../services/cadastro-service';

type UsuarioForm = {
  id?: string;
  nome: string;
  cpf: string;
  login: string;
  senha: string;
  perfil: string;
};

const perfis = ['dev', 'user', 'admin'];

export default function CadastroUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resposta, setResposta] = useState('');
  const [cpfInvalido, setCpfInvalido] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsuarioForm>();

  const mutation = useMutation({
    mutationFn: (data: UsuarioForm) =>
      id ? atualizarUsuario(id, data) : cadastrarUsuario(data),
    onSuccess: () => {
      setResposta(id ? 'Dados atualizados com sucesso!' : 'Dados cadastrados com sucesso!');
      setMostrarModal(true);
    },
    onError: () => {
      setResposta(id ? 'Erro ao atualizar o usuário!' : 'Erro ao cadastrar o usuário!');
      setMostrarModal(true);
    },
  });

  const { data: usuario } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => buscarUsuarioPorId(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (usuario) {
      reset(usuario);
    }
  }, [usuario]);

  const verificarCpf = async (cpf: string) => {
    const validado:any = await validarCpf(cpf);
    setCpfInvalido(!validado.valido);
  };

  const onSubmit = (data: UsuarioForm) => {
    setResposta('');
    mutation.mutate(data);
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header py-3 mb-2">
          <h6 className="m-0 font-weight-bold text-secondary">Cadastro de Usuários</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {id && (
              <input type="text" className="form-control mb-3" disabled {...register('id')} />
            )}
            <div className="mb-3">
              <label>Nome<input className="form-control" {...register('nome', { required: true })} />
                {errors.nome && <small className="text-danger">Campo obrigatório</small>}
              </label>
            </div>

            <div className="mb-3">
              <label>CPF<input
                  className="form-control"
                  {...register('cpf', { required: true })}
                  onBlur={(e) => verificarCpf(e.target.value)}
                />
              </label>
              {errors.cpf && <small className="text-danger">Campo obrigatório</small>}
              {cpfInvalido && <small className="text-danger">CPF inválido</small>}
            </div>

            <div className="mb-3">
              <label>Login<input className="form-control" {...register('login', { required: true })} />
                {errors.login && <small className="text-danger">Campo obrigatório</small>}
              </label>
            </div>

            <div className="mb-3">
              <label>Senha<input type="password" className="form-control" {...register('senha', { required: true })} />
                {errors.senha && <small className="text-danger">Campo obrigatório</small>}
              </label>
            </div>

            <div className="mb-3">
              <label>Perfil<select className="form-control" {...register('perfil', { required: true })}>
                  <option value="">--Selecione o perfil--</option>
                  {perfis.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.perfil && <small className="text-danger">Campo obrigatório</small>}
              </label>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button className="btn btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : id ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button type="button" className="btn btn-warning" onClick={() => reset()}>
                Limpar Formulário
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cadastro de Usuário</h5>
                <button type="button" className="btn-close" onClick={() => navigate('/')} />
              </div>
              <div className="modal-body">
                <p>{resposta}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
