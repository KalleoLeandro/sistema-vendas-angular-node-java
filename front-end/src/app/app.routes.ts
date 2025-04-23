import { Routes } from '@angular/router';
import { authGuardGuard } from '@guards/auth.guard.guard';
import { CadastroUsuarioComponent } from '@pages/usuarios/cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [
    {
        path: 'teste', loadComponent: () => import("@pages/teste/teste.component").then(c => c.TesteComponent),
    },
    {
        path: 'login', loadComponent: () => import("@pages/login/login.component").then(c => c.LoginComponent)
    },
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: '', loadComponent: () => import("@pages/main/main.component").then(c => c.MainComponent), canActivate: [authGuardGuard], children: [
            { 
                path: 'home', loadComponent: () => import("@pages/main/home/home.component").then(c => c.HomeComponent),
            },
            {
                path: 'usuarios', children: [
                    { path: 'cadastro', loadComponent: () => import("@pages/usuarios/cadastro-usuario/cadastro-usuario.component").then(c => c.CadastroUsuarioComponent)},
                    { path: 'cadastro/:id', loadComponent: () => import("@pages/usuarios/cadastro-usuario/cadastro-usuario.component").then(c => c.CadastroUsuarioComponent)},
                    //{ path: 'lista', component: ListarUsuarioComponent }
                ]
            },
            /*{
                path: 'produtos', children: [
                    { path: 'cadastro', component: CadastrarProdutoComponent },
                    { path: 'cadastro/:id', component: CadastrarProdutoComponent }
                ]
            }*/
        ]
    },    
    {
        path: '404', loadComponent: () => import("@pages/error/error.component").then(c => c.ErrorComponent)
    },
    { 
        path: '**', redirectTo: '404' 
    }
];
