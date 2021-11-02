import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./services/authguard.service";

export const AppRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'dashboard',
                loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'user-management',
                loadChildren: './pages/usermanagement/usermanagement.module#UserManagementModule'
            },
            {
                path: 'upload-management',
                loadChildren: './pages/uploadmanagement/uploadmanagement.module#UploadManagementModule'
            }
        ],
        resolve: {
            user: AuthGuard
        }
    },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'login' }
];
