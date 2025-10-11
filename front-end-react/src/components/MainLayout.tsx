import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {

    useEffect(() => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (!sidebarToggle) return;
    
    if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
      document.body.classList.add('sb-sidenav-toggled');
    }
    
    const handleToggle = (event: Event) => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', String(document.body.classList.contains('sb-sidenav-toggled')));
    };

    sidebarToggle.addEventListener('click', handleToggle);

    // Cleanup: remove o listener ao desmontar o componente
    return () => {
      sidebarToggle.removeEventListener('click', handleToggle);
    };
  }, []);
  
  return (
    <div className={"sb-nav-fixed"}>
      <nav className={"sb-topnav navbar navbar-expand navbar-dark bg-dark"}>
        <Link className={"navbar-brand ps-3"} to="/home">Sistema Vendas</Link>

        <button className={"btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"} id="sidebarToggle">
          <i className={"fas fa-bars"}></i>
        </button>

        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Buscar" aria-label="Buscar" />
            <button className="btn btn-primary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>

        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4 bg-dark">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#!">Perfil</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#!">Sair</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Principal</div>
                <Link className="nav-link" to="/home">
                  <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                  Dashboard
                </Link>

                <div className="sb-sidenav-menu-heading">Cadastros</div>
                <a className="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>
                  Usuários
                  <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                </a>

                <div className="collapse" id="collapseLayouts">
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link className="nav-link" to="/usuarios/cadastro">Cadastrar Usuário</Link>
                    <Link className="nav-link" to="/usuarios/listar">Listar Usuários</Link>
                  </nav>
                </div>

                <a className="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-box"></i></div>
                  Produtos
                  <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                </a>

                {/* Outros menus colapsáveis omitidos por simplicidade */}

                <div className="sb-sidenav-menu-heading">Operações</div>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                  Charts
                </a>
                <a className="nav-link" href="tables.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                  Tables
                </a>
              </div>
            </div>

            <div className="sb-sidenav-footer">
              <div className="small">Sistema Vendas</div>
              Versão:
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid">
              <Outlet />
            </div>
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-center small">
                <div className="text-muted">&copy; Todos os direitos reservados</div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
