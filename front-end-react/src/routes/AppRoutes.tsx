import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home from '../pages/Home/Home';
import NotFound from '../pages/Error/NotFound';
import Login from '../pages/Login/Login';
import MainLayout from '../components/MainLayout';
import PrivateRoute from './PrivateRoute';
import CadastroUsuario from '../pages/Usuarios/Cadastro-Usuarios/CadastroUsuarios';

const AppRoutes = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
         <Route path="/usuarios">
            <Route path="cadastro" element={<CadastroUsuario />} />
            <Route path="cadastro/:id" element={<CadastroUsuario />} />            
          </Route>
        </Route>        
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
