import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VerifTokenComponent } from '../list/verif-token.component';
import { VerifTokenDetailComponent } from '../detail/verif-token-detail.component';
import { VerifTokenUpdateComponent } from '../update/verif-token-update.component';
import { VerifTokenRoutingResolveService } from './verif-token-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const verifTokenRoute: Routes = [
  {
    path: '',
    component: VerifTokenComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VerifTokenDetailComponent,
    resolve: {
      verifToken: VerifTokenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VerifTokenUpdateComponent,
    resolve: {
      verifToken: VerifTokenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VerifTokenUpdateComponent,
    resolve: {
      verifToken: VerifTokenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(verifTokenRoute)],
  exports: [RouterModule],
})
export class VerifTokenRoutingModule {}
