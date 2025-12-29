import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchFlightsComponent } from './pages/search-flights/search-flights.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { BookingComponent } from './pages/ticketbooking/booking/booking';
import { userGuard } from './guards/user.guard';
import { AdminFlightsComponent } from './pages/admin-flights/admin-flights.component';
import { AddFlightComponent } from './pages/add-flight/add-flight.component';
import { adminGuard } from './guards/admin.guard';
import { SearchPnrComponent } from './pages/ticketbooking/search-pnr/search-pnr.component';
import { CancelBookingComponent } from './pages/ticketbooking/cancel-booking/cancel-booking.component';
import { SearchEmailComponent } from './pages/ticketbooking/search-email/search-email.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'search', component: SearchFlightsComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [userGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard]
  },
  { path: 'booking', component: BookingComponent, canActivate:[userGuard]},
  { path: 'search-pnr', component: SearchPnrComponent, canActivate:[userGuard] },
  { path: 'search-email', component: SearchEmailComponent, canActivate:[userGuard]},
  { path: 'cancel-booking', component: CancelBookingComponent, canActivate:[userGuard] }, 
  { path: 'admin-flights', component: AdminFlightsComponent, canActivate: [adminGuard] },
  { path: 'add-flight', component: AddFlightComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];