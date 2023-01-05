import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VerifTokenFormService } from './verif-token-form.service';
import { VerifTokenService } from '../service/verif-token.service';
import { IVerifToken } from '../verif-token.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { VerifTokenUpdateComponent } from './verif-token-update.component';

describe('VerifToken Management Update Component', () => {
  let comp: VerifTokenUpdateComponent;
  let fixture: ComponentFixture<VerifTokenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let verifTokenFormService: VerifTokenFormService;
  let verifTokenService: VerifTokenService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VerifTokenUpdateComponent],
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
      .overrideTemplate(VerifTokenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VerifTokenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    verifTokenFormService = TestBed.inject(VerifTokenFormService);
    verifTokenService = TestBed.inject(VerifTokenService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const verifToken: IVerifToken = { id: 456 };
      const userid: IUser = { id: 13450 };
      verifToken.userid = userid;

      const userCollection: IUser[] = [{ id: 35591 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [userid];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ verifToken });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const verifToken: IVerifToken = { id: 456 };
      const userid: IUser = { id: 32702 };
      verifToken.userid = userid;

      activatedRoute.data = of({ verifToken });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(userid);
      expect(comp.verifToken).toEqual(verifToken);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVerifToken>>();
      const verifToken = { id: 123 };
      jest.spyOn(verifTokenFormService, 'getVerifToken').mockReturnValue(verifToken);
      jest.spyOn(verifTokenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ verifToken });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: verifToken }));
      saveSubject.complete();

      // THEN
      expect(verifTokenFormService.getVerifToken).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(verifTokenService.update).toHaveBeenCalledWith(expect.objectContaining(verifToken));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVerifToken>>();
      const verifToken = { id: 123 };
      jest.spyOn(verifTokenFormService, 'getVerifToken').mockReturnValue({ id: null });
      jest.spyOn(verifTokenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ verifToken: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: verifToken }));
      saveSubject.complete();

      // THEN
      expect(verifTokenFormService.getVerifToken).toHaveBeenCalled();
      expect(verifTokenService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVerifToken>>();
      const verifToken = { id: 123 };
      jest.spyOn(verifTokenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ verifToken });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(verifTokenService.update).toHaveBeenCalled();
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
