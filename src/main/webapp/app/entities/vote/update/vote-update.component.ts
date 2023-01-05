import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VoteFormService, VoteFormGroup } from './vote-form.service';
import { IVote } from '../vote.model';
import { VoteService } from '../service/vote.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { VoteType } from 'app/entities/enumerations/vote-type.model';

@Component({
  selector: 'jhi-vote-update',
  templateUrl: './vote-update.component.html',
})
export class VoteUpdateComponent implements OnInit {
  isSaving = false;
  vote: IVote | null = null;
  voteTypeValues = Object.keys(VoteType);

  usersSharedCollection: IUser[] = [];
  postsSharedCollection: IPost[] = [];

  editForm: VoteFormGroup = this.voteFormService.createVoteFormGroup();

  constructor(
    protected voteService: VoteService,
    protected voteFormService: VoteFormService,
    protected userService: UserService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vote }) => {
      this.vote = vote;
      if (vote) {
        this.updateForm(vote);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vote = this.voteFormService.getVote(this.editForm);
    if (vote.id !== null) {
      this.subscribeToSaveResponse(this.voteService.update(vote));
    } else {
      this.subscribeToSaveResponse(this.voteService.create(vote));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVote>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(vote: IVote): void {
    this.vote = vote;
    this.voteFormService.resetForm(this.editForm, vote);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, vote.userid);
    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, vote.postid);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.vote?.userid)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.vote?.postid)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
