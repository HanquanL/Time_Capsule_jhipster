import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserUploadFileComponent } from '../list/user-upload-file.component';
import { UserUploadFileDetailComponent } from '../detail/user-upload-file-detail.component';
import { UserUploadFileUpdateComponent } from '../update/user-upload-file-update.component';
import { UserUploadFileRoutingResolveService } from './user-upload-file-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userUploadFileRoute: Routes = [
  {
    path: '',
    component: UserUploadFileComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserUploadFileDetailComponent,
    resolve: {
      userUploadFile: UserUploadFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserUploadFileUpdateComponent,
    resolve: {
      userUploadFile: UserUploadFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserUploadFileUpdateComponent,
    resolve: {
      userUploadFile: UserUploadFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userUploadFileRoute)],
  exports: [RouterModule],
})
export class UserUploadFileRoutingModule {}
