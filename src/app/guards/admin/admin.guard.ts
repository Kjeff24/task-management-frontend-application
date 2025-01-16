import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const token = inject(TokenService);
  const router = inject(Router);

  const isAdmin = token.getPayload()?.isAdmin;

  if (isAdmin === false) {
    router.navigate(['']);
    alert('You are not an admin');
    return false;
  }

  return isAdmin === true;
};
