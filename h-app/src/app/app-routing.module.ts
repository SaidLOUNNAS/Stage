import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },

  {
    path: 'formateurs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/formateurs/formateurs.module').then((m) => m.FormateursModule),
  },

  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/etudiants/users.module').then((m) => m.UsersModule),
  },

  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
  },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
