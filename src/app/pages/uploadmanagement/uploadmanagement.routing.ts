import { Routes } from '@angular/router';

import { CategoryListComponent } from './category-list.component/category-list.component';
import { ImageListComponent } from './image-list/image-list.component';
import { UploadIamgeComponent } from './uploadimage/uploadimage.component';
import { ModelreleaseListComponent } from './modelrelease-list/modelrelease-list.component';
import { EditIamgeComponent } from './editimage/editimage.component';

export const UploadManagementRoutes: Routes = [
  {
    path: 'category-list',
    component: CategoryListComponent
  },
  {
    path: 'image-list',
    component: ImageListComponent
  },
  {
    path: 'upload-image',
    component: UploadIamgeComponent
  },
  {
    path: 'edit-image/:imageId',
    component: EditIamgeComponent
  },
  {
    path: 'modelrelease-list',
    component: ModelreleaseListComponent
  }
];
