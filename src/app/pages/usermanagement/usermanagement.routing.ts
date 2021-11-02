import { Routes } from '@angular/router';

import { UserListComponent } from './list/user-list.component';
import { UserEditComponent } from './edit/user-edit.component';
import { UserCreateComponent } from './create/user-create.component';

export const UserManagementRoutes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'create',
    component: UserCreateComponent
  },
  {
    path: 'edit/:userId',
    component: UserEditComponent
  }
];
