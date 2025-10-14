import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
      return throwError(() => error);
    })
  );
};