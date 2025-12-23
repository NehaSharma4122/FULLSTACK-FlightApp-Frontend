import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 1. Import
import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor'; // Your interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])) // 2. PROVIDE IT HERE
  ]
};