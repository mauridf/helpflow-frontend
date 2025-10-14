import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obter token do localStorage
  const token = localStorage.getItem('authToken');
  
  // Clonar request e adicionar headers se token existir
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      
      // Se for erro 401 (Unauthorized), fazer logout
      if (error.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuarioData');
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};