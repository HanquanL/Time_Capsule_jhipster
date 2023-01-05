import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VoteFormService } from './vote-form.service';
import { VoteService } from '../service/vote.service';
import { IVote } from '../vote.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { VoteUpdateComponent } from './vote-update.component';

describe('Vote Management Update Component', () => {
  let comp: VoteUpdateComponent;
  let fixture: ComponentFixture<VoteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let voteFormService: VoteFormService;
  let voteService: VoteService;
  let userService: UserService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VoteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VoteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    voteFormService = TestBed.inject(VoteFormService);
    voteService = TestBed.inject(VoteService);
    userService = TestBed.inject(UserService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const vote: IVote = { id: 456 };
      const userid: IUser = { id: 21774 };
      vote.userid = userid;

      const userCollection: IUser[] = [{ id: 95540 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [userid];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vote });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Post query and add missing value', () => {
      const vote: IVote = { id: 456 };
      const postid: IPost = { id: 97743 };
      vote.postid = postid;

      const postCollection: IPost[] = [{ id: 89257 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [postid];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vote });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vote: IVote = { id: 456 };
      const userid: IUser = { id: 66419 };
      vote.userid = userid;
      const postid: IPost = { id: 33558 };
      vote.postid = postid;

      activatedRoute.data = of({ vote });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(userid);
      expect(comp.postsSharedCollection).toContain(postid);
      expect(comp.vote).toEqual(vote);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVote>>();
      const vote = { id: 123 };
      jest.spyOn(voteFormService, 'getVote').mockReturnValue(vote);
      jest.spyOn(voteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vote }));
      saveSubject.complete();

      // THEN
      expect(voteFormService.getVote).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(voteService.update).toHaveBeenCalledWith(expect.objectContaining(vote));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVote>>();
      const vote = { id: 123 };
      jest.spyOn(voteFormService, 'getVote').mockReturnValue({ id: null });
      jest.spyOn(voteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vote: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vote }));
      saveSubject.complete();

      // THEN
      expect(voteFormService.getVote).toHaveBeenCalled();
      expect(voteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVote>>();
      const vote = { id: 123 };
      jest.spyOn(voteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vote });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(voteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePost', () => {
      it('Should forward to postService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(postService, 'comparePost');
        comp.comparePost(entity, entity2);
        expect(postService.comparePost).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
