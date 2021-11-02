import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../../md/md.module';
import { MaterialModule } from '../../app.module';

import { SharedModule } from 'app/shared/shared.module';
import { CategoryListComponent } from './category-list.component/category-list.component';
import { UploadManagementRoutes } from './uploadmanagement.routing';
import { ImageListComponent } from './image-list/image-list.component';
import { UploadIamgeComponent } from './uploadimage/uploadimage.component';
import { ModelreleaseListComponent } from './modelrelease-list/modelrelease-list.component';
import { EditIamgeComponent } from './editimage/editimage.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UploadManagementRoutes),
    FormsModule,
    MdModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CategoryListComponent,
    ImageListComponent,
    UploadIamgeComponent,
    ModelreleaseListComponent,
    EditIamgeComponent
  ]
})

export class UploadManagementModule { }