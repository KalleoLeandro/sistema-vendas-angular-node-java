import { inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '@services/login.service';
import { catchError, map, of } from 'rxjs';

export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(LoginService);
  const router = inject(Router);
  return authService.validarToken().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        sessionStorage.clear();
        return router.createUrlTree(['login']);
      }
    }),
    catchError(() => {
      sessionStorage.clear();        
      return of(router.createUrlTree(['login']));
    })
  );  
};
