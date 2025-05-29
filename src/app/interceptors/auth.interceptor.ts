import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  console.log(`HTTP ${req.method} ${req.url} - Token exists:`, !!token);
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Added Authorization header to request');
    return next(authReq);
  }
  
  console.log('No token found, proceeding without Authorization header');
  return next(req);
}; 