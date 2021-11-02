import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../../md/md.module';
import { MaterialModule } from '../../app.module';

import { UserListComponent } from './list/user-list.component';
import { UserManagementRoutes } from './usermanagement.routing';
import { UserEditComponent } from './edit/user-edit.component';
import { UserCreateComponent } from './create/user-create.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserManagementRoutes),
    FormsModule,
    MdModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    UserListComponent,
    UserEditComponent,
    UserCreateComponent
  ]
})

export class UserManagementModule { }
