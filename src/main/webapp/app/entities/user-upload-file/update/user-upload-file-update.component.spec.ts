import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserUploadFileFormService } from './user-upload-file-form.service';
import { UserUploadFileService } from '../service/user-upload-file.service';
import { IUserUploadFile } from '../user-upload-file.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserUploadFileUpdateComponent } from './user-upload-file-update.component';

describe('UserUploadFile Management Update Component', () => {
  let comp: UserUploadFileUpdateComponent;
  let fixture: ComponentFixture<UserUploadFileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userUploadFileFormService: UserUploadFileFormService;
  let userUploadFileService: UserUploadFileService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserUploadFileUpdateComponent],
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
      .overrideTemplate(UserUploadFileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserUploadFileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userUploadFileFormService = TestBed.inject(UserUploadFileFormService);
    userUploadFileService = TestBed.inject(UserUploadFileService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userUploadFile: IUserUploadFile = { id: 456 };
      const userid: IUser = { id: 5156 };
      userUploadFile.userid = userid;

      const userCollection: IUser[] = [{ id: 98314 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [userid];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userUploadFile });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userUploadFile: IUserUploadFile = { id: 456 };
      const userid: IUser = { id: 68476 };
      userUploadFile.userid = userid;

      activatedRoute.data = of({ userUploadFile });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(userid);
      expect(comp.userUploadFile).toEqual(userUploadFile);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserUploadFile>>();
      const userUploadFile = { id: 123 };
      jest.spyOn(userUploadFileFormService, 'getUserUploadFile').mockReturnValue(userUploadFile);
      jest.spyOn(userUploadFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userUploadFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userUploadFile }));
      saveSubject.complete();

      // THEN
      expect(userUploadFileFormService.getUserUploadFile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userUploadFileService.update).toHaveBeenCalledWith(expect.objectContaining(userUploadFile));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserUploadFile>>();
      const userUploadFile = { id: 123 };
      jest.spyOn(userUploadFileFormService, 'getUserUploadFile').mockReturnValue({ id: null });
      jest.spyOn(userUploadFileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userUploadFile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userUploadFile }));
      saveSubject.complete();

      // THEN
      expect(userUploadFileFormService.getUserUploadFile).toHaveBeenCalled();
      expect(userUploadFileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserUploadFile>>();
      const userUploadFile = { id: 123 };
      jest.spyOn(userUploadFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userUploadFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userUploadFileService.update).toHaveBeenCalled();
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
  });
});
