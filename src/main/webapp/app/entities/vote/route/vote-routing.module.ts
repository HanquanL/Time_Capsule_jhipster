import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoteComponent } from '../list/vote.component';
import { VoteDetailComponent } from '../detail/vote-detail.component';
import { VoteUpdateComponent } from '../update/vote-update.component';
import { VoteRoutingResolveService } from './vote-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const voteRoute: Routes = [
  {
    path: '',
    component: VoteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoteDetailComponent,
    resolve: {
      vote: VoteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoteUpdateComponent,
    resolve: {
      vote: VoteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoteUpdateComponent,
    resolve: {
      vote: VoteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(voteRoute)],
  exports: [RouterModule],
})
export class VoteRoutingModule {}
