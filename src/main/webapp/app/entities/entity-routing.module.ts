import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-upload-file',
        data: { pageTitle: 'oneTimaCapsuleApp.userUploadFile.home.title' },
        loadChildren: () => import('./user-upload-file/user-upload-file.module').then(m => m.UserUploadFileModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'oneTimaCapsuleApp.post.home.title' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'vote',
        data: { pageTitle: 'oneTimaCapsuleApp.vote.home.title' },
        loadChildren: () => import('./vote/vote.module').then(m => m.VoteModule),
      },
      {
        path: 'sub-time-capsule',
        data: { pageTitle: 'oneTimaCapsuleApp.subTimeCapsule.home.title' },
        loadChildren: () => import('./sub-time-capsule/sub-time-capsule.module').then(m => m.SubTimeCapsuleModule),
      },
      {
        path: 'verif-token',
        data: { pageTitle: 'oneTimaCapsuleApp.verifToken.home.title' },
        loadChildren: () => import('./verif-token/verif-token.module').then(m => m.VerifTokenModule),
      },
      {
        path: 'email',
        data: { pageTitle: 'oneTimaCapsuleApp.email.home.title' },
        loadChildren: () => import('./email/email.module').then(m => m.EmailModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
