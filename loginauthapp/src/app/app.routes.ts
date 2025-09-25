import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ConfirmOtp } from './components/confirm-otp/confirm-otp';
import { ResetPassword } from './components/reset-password/reset-password';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'confirm-otp', component: ConfirmOtp },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] }
];
