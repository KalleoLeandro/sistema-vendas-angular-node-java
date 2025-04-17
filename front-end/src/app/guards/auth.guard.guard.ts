import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  /*const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.checkLogin().pipe(
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
  );*/
  return true;
};
