import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PostFormService, PostFormGroup } from './post-form.service';
import { IPost } from '../post.model';
import { PostService } from '../service/post.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISubTimeCapsule } from 'app/entities/sub-time-capsule/sub-time-capsule.model';
import { SubTimeCapsuleService } from 'app/entities/sub-time-capsule/service/sub-time-capsule.service';

@Component({
  selector: 'jhi-post-update',
  templateUrl: './post-update.component.html',
})
export class PostUpdateComponent implements OnInit {
  isSaving = false;
  post: IPost | null = null;

  usersSharedCollection: IUser[] = [];
  subTimeCapsulesSharedCollection: ISubTimeCapsule[] = [];

  editForm: PostFormGroup = this.postFormService.createPostFormGroup();

  constructor(
    protected postService: PostService,
    protected postFormService: PostFormService,
    protected userService: UserService,
    protected subTimeCapsuleService: SubTimeCapsuleService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSubTimeCapsule = (o1: ISubTimeCapsule | null, o2: ISubTimeCapsule | null): boolean =>
    this.subTimeCapsuleService.compareSubTimeCapsule(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.post = post;
      if (post) {
        this.updateForm(post);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const post = this.postFormService.getPost(this.editForm);
    if (post.id !== null) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
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

  protected updateForm(post: IPost): void {
    this.post = post;
    this.postFormService.resetForm(this.editForm, post);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, post.userid);
    this.subTimeCapsulesSharedCollection = this.subTimeCapsuleService.addSubTimeCapsuleToCollectionIfMissing<ISubTimeCapsule>(
      this.subTimeCapsulesSharedCollection,
      post.subTimeCapsule
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.post?.userid)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.subTimeCapsuleService
      .query()
      .pipe(map((res: HttpResponse<ISubTimeCapsule[]>) => res.body ?? []))
      .pipe(
        map((subTimeCapsules: ISubTimeCapsule[]) =>
          this.subTimeCapsuleService.addSubTimeCapsuleToCollectionIfMissing<ISubTimeCapsule>(subTimeCapsules, this.post?.subTimeCapsule)
        )
      )
      .subscribe((subTimeCapsules: ISubTimeCapsule[]) => (this.subTimeCapsulesSharedCollection = subTimeCapsules));
  }
}
