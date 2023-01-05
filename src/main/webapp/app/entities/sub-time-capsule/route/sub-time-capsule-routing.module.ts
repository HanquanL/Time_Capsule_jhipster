import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SubTimeCapsuleComponent } from '../list/sub-time-capsule.component';
import { SubTimeCapsuleDetailComponent } from '../detail/sub-time-capsule-detail.component';
import { SubTimeCapsuleUpdateComponent } from '../update/sub-time-capsule-update.component';
import { SubTimeCapsuleRoutingResolveService } from './sub-time-capsule-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const subTimeCapsuleRoute: Routes = [
  {
    path: '',
    component: SubTimeCapsuleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubTimeCapsuleDetailComponent,
    resolve: {
      subTimeCapsule: SubTimeCapsuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubTimeCapsuleUpdateComponent,
    resolve: {
      subTimeCapsule: SubTimeCapsuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubTimeCapsuleUpdateComponent,
    resolve: {
      subTimeCapsule: SubTimeCapsuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(subTimeCapsuleRoute)],
  exports: [RouterModule],
})
export class SubTimeCapsuleRoutingModule {}
