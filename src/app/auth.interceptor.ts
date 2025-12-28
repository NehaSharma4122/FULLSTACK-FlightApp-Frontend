import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isGatewayRequest = req.url.includes('localhost');

  if (token && isGatewayRequest) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Interceptor: Attaching Token to request: ${req.url}`);
    return next(cloned);
  }
  return next(req);
};