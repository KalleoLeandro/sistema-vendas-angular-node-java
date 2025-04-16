import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'teste', loadComponent: ()=> import("@components/teste/teste.component").then( c  => c.TesteComponent)
    }
];
